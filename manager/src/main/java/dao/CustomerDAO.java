package dao;

import model.Customer;
import java.sql.*;
import java.util.*;

public class CustomerDAO {
    private Connection conn;

    public CustomerDAO(Connection conn) {
        this.conn = conn;
    }

    public List<Customer> getAllCustomers() throws SQLException {
        List<Customer> list = new ArrayList<>();
        String sql = "SELECT * FROM Customer";
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql);
        while (rs.next()) {
            list.add(new Customer(
                rs.getInt("customer_id"),
                rs.getString("name"),
                rs.getString("email"),
                rs.getString("phone")
                ));
        }
        return list;
    }

    public void addCustomer(Customer customer) throws SQLException {
        String sql = "INSERT INTO Customer (name, email, phone) VALUES (?, ?, ?)";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, customer.getName());
        stmt.setString(2, customer.getEmail());
        stmt.setString(3, customer.getPhone());
        stmt.executeUpdate();
    }

    public void updateCustomer(Customer customer) throws SQLException {
        String sql = "UPDATE Customer SET name=?, email=?, phone=? WHERE customer_id=?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setString(1, customer.getName());
        stmt.setString(2, customer.getEmail());
        stmt.setString(3, customer.getPhone());
        stmt.setInt(4, customer.getCustomerId());
        stmt.executeUpdate();
    }

    public void deleteCustomer(int id) throws SQLException {
        String sql = "DELETE FROM Customer WHERE customer_id=?";
        PreparedStatement stmt = conn.prepareStatement(sql);
        stmt.setInt(1, id);
        stmt.executeUpdate();
    }
}
