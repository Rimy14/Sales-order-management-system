package com.spil.salesorder.service.interfaces;

import com.spil.salesorder.dto.SalesOrderDTO;

import java.util.List;

public interface SalesOrderService {
    List<SalesOrderDTO> getAllOrders();
    SalesOrderDTO getOrderById(Long id);
    SalesOrderDTO createOrder(SalesOrderDTO salesOrderDTO);
    SalesOrderDTO updateOrder(Long id, SalesOrderDTO salesOrderDTO);
    void deleteOrder(Long id);
}
