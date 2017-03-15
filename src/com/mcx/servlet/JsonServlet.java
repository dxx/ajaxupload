package com.mcx.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JsonServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	@Override
	public void service(ServletRequest arg0, ServletResponse arg1)
			throws ServletException, IOException {
		//HttpServletResponse resp = (HttpServletResponse) arg1;
		//resp.setHeader("Access-Control-Allow-Origin", "*");
		//resp.setHeader("Access-Control-Allow-Origin-Methods", "POST,OPTIONS");
		//resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
		super.service(arg0, arg1);
	}
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		System.out.println("content-type：" + req.getContentType());
		
		resp.setContentType("text/html;charset=utf-8");
		PrintWriter pw = resp.getWriter();
		InputStream is = req.getInputStream();
		InputStreamReader isr = new InputStreamReader(is, "utf-8");
		BufferedReader br = new BufferedReader(isr);
		String str = null;
		StringBuffer sb = new StringBuffer();
		if( (str = br.readLine()) != null){
			sb.append(str);
		}
		System.out.println(sb.toString());
		br.close();
		pw.print("{\"result\":\"1\",\"message\":\"success\"}");
		pw.close();
	}
}
