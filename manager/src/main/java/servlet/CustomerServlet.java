package servlet;

import dao.CustomerDAO;
import model.Customer;
import util.DBConnection;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.sql.Connection;
import java.util.List;

@WebServlet("/api/customers/*")
public class CustomerServlet extends HttpServlet {
    private CustomerDAO customerDAO;

    @Override
    public void init() throws ServletException {
        try {
            Connection conn = DBConnection.getConnection();
            customerDAO = new CustomerDAO(conn);
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }

    // ✅ Minimal CORS headers — no credentials
    private void setCORS(HttpServletResponse res) {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    // ✅ Handle preflight CORS requests
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) throws IOException {
        setCORS(res);
        res.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        setCORS(res);
        res.setContentType("application/json");

        try {
            List<Customer> customers = customerDAO.getAllCustomers();
            String json = new Gson().toJson(customers);
            res.getWriter().write(json);
        } catch (Exception e) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            res.getWriter().write("{\"error\":\"Failed to fetch customers.\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        setCORS(res);
        BufferedReader reader = req.getReader();
        Customer customer = new Gson().fromJson(reader, Customer.class);
        try {
            customerDAO.addCustomer(customer);
            res.setStatus(HttpServletResponse.SC_CREATED);
        } catch (Exception e) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {
        setCORS(res);
        BufferedReader reader = req.getReader();
        Customer customer = new Gson().fromJson(reader, Customer.class);
        try {
            customerDAO.updateCustomer(customer);
            res.setStatus(HttpServletResponse.SC_OK);
        } catch (Exception e) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException {
        setCORS(res);
        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/")) {
            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        int id = Integer.parseInt(pathInfo.substring(1));
        try {
            customerDAO.deleteCustomer(id);
            res.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } catch (Exception e) {
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
