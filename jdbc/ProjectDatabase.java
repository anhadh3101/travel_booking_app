import java.sql.*;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;
import com.google.gson.*;

public class ProjectDatabase {
    static final String DB_NAME = "TravelDB";

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter MySQL username: ");
        String USER = scanner.nextLine();
        System.out.print("Enter MySQL password: ");
        String PASS = scanner.nextLine();

        String DB_URL = "jdbc:mysql://localhost/";
        

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            // Create Database
            String createDatabaseSQL= ("CREATE DATABASE IF NOT EXISTS " + DB_NAME);
            stmt.executeUpdate(createDatabaseSQL);
            System.out.println("Database '" + DB_NAME +"' created.");

        } catch (SQLException e) {
            e.printStackTrace();
            return;
        }

        // Connect to the created DB
        DB_URL += DB_NAME;

        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            createTables(stmt);
            populateTables(stmt);
            exportTableToJson(conn, "Customer", "customers.json");
            exportTableToJson(conn, "Flight", "flights.json");
            exportTableToJson(conn, "Hotel", "hotels.json");
            exportTableToJson(conn, "Booking", "bookings.json");

        } catch (Exception e) {
            e.printStackTrace();
        }

        scanner.close();
    }

    static void createTables(Statement stmt) throws SQLException {
        stmt.executeUpdate("""
            CREATE TABLE IF NOT EXISTS Customer (
                customer_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(15) NOT NULL
            );
            """);

        stmt.executeUpdate("""
            CREATE TABLE IF NOT EXISTS Flight (
                flight_id INT PRIMARY KEY AUTO_INCREMENT,
                origin VARCHAR(100) NOT NULL,
                destination VARCHAR(100) NOT NULL,
                departure_time DATETIME NOT NULL,
                arrival_time DATETIME NOT NULL,
                price DECIMAL(10,2) NOT NULL
            );
            """);

        stmt.executeUpdate("""
            CREATE TABLE IF NOT EXISTS Hotel (
                hotel_id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                price_per_night DECIMAL(10,2) NOT NULL
            );
            """);

        stmt.executeUpdate("""
            CREATE TABLE IF NOT EXISTS Booking (
                booking_id INT PRIMARY KEY AUTO_INCREMENT,
                customer_id INT NOT NULL,
                flight_id INT NOT NULL,
                hotel_id INT NOT NULL,
                booking_date DATE NOT NULL,
                FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
                FOREIGN KEY (flight_id) REFERENCES Flight(flight_id),
                FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id)
            );
            """);

        System.out.println("Tables created.");
    }

    static void populateTables(Statement stmt) throws SQLException {
       
    	
    	for (int i = 1; i <= 15; i++) {
        	String insertCustomerSQL = String.format(
                    "INSERT INTO Customer (name, email, phone) VALUES ('Customer%d', 'cust%d@example.com', '123456789%d')",
                    i, i, i);
            stmt.executeUpdate(insertCustomerSQL);
            
            String insertFlightSQL = String.format(
                    "INSERT INTO Flight (origin, destination, departure_time, arrival_time, price) " +
                            "VALUES ('City%d', 'City%d', '2025-06-%02d 08:00:00', '2025-06-%02d 12:00:00', %.2f)",
                    i, i + 1, i, i, 100 + i * 5.5);
            stmt.executeUpdate(insertFlightSQL);
            
            String insertHotelSQL = String.format(
                    "INSERT INTO Hotel (name, city, price_per_night) VALUES ('Hotel%d', 'City%d', %.2f)",
                    i, i, 50 + i * 3.25);
            stmt.executeUpdate(insertHotelSQL);
            
            String insertBookingSQL = String.format(
                    "INSERT INTO Booking (customer_id, flight_id, hotel_id, booking_date) " +
                            "VALUES (%d, %d, %d, '2025-06-%02d')",
                    i, i, i, i);
            stmt.executeUpdate(insertBookingSQL);
            
        }

        System.out.println("Sample data inserted.");
    }

    static void exportTableToJson(Connection conn, String tableName, String outputFile) throws SQLException, IOException {
        String query = "SELECT * FROM " + tableName;
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            ResultSetMetaData meta = rs.getMetaData();
            int columnCount = meta.getColumnCount();

            JsonArray jsonArray = new JsonArray();

            while (rs.next()) {
                JsonObject rowObject = new JsonObject();
                for (int i = 1; i <= columnCount; i++) {
                    String column = meta.getColumnName(i);
                    Object value = rs.getObject(i);
                    if (value == null) {
                        rowObject.add(column, JsonNull.INSTANCE);
                    } else if (value instanceof Integer) {
                        rowObject.addProperty(column, (Integer) value);
                    } else if (value instanceof Double) {
                        rowObject.addProperty(column, (Double) value);
                    } else {
                        rowObject.addProperty(column, value.toString());
                    }
                }
                jsonArray.add(rowObject);
            }

            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            try (FileWriter writer = new FileWriter(outputFile)) {
                gson.toJson(jsonArray, writer);
            }

            System.out.println("Exported " + tableName + " to " + outputFile);
        }
    }
}

