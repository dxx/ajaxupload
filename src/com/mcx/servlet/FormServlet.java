package com.mcx.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FormServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		System.out.println("content-type：" + req.getContentType());
		
		resp.setContentType("text/html;charset=utf-8");
		//resp.setHeader("Access-Control-Allow-Origin", "*");
		PrintWriter pw = resp.getWriter();
		Enumeration<String> em = req.getParameterNames();
		while(em.hasMoreElements()){
			String name = em.nextElement();
			if("love".equals(name)){
				System.out.println("name=" + name + ",value=" + Arrays.toString(req.getParameterValues("love")));
			}else{
				System.out.println("name=" + name + ",value=" + req.getParameter(name));
			}
		}
		pw.print("{\"result\":\"1\",\"message\":\"success\"}");
		pw.close();
	}
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		System.out.println("content-type：" + req.getContentType());
		
		resp.setContentType("text/html;charset=utf-8");
		//resp.setHeader("Access-Control-Allow-Origin", "*");
		PrintWriter pw = resp.getWriter();
		Enumeration<String> em = req.getParameterNames();
		while(em.hasMoreElements()){
			String name = em.nextElement();
			if("love".equals(name)){
				System.out.println("name=" + name + ",value=" + Arrays.toString(req.getParameterValues("love")));
			}else{
				System.out.println("name=" + name + ",value=" + req.getParameter(name));
			}
		}
		pw.print("{\"result\":\"1\",\"message\":\"success\"}");
		pw.close();
	}
}
