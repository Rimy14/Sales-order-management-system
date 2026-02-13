package com.spil.salesorder.controller;

import com.spil.salesorder.dto.SalesOrderDTO;
import com.spil.salesorder.service.interfaces.SalesOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SalesOrderController {
    
    private final SalesOrderService salesOrderService;
    
    @GetMapping
    public ResponseEntity<List<SalesOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(salesOrderService.getAllOrders());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.getOrderById(id));
    }
    
    @PostMapping
    public ResponseEntity<SalesOrderDTO> createOrder(@RequestBody SalesOrderDTO salesOrderDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salesOrderService.createOrder(salesOrderDTO));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> updateOrder(
            @PathVariable Long id,
            @RequestBody SalesOrderDTO salesOrderDTO) {
        return ResponseEntity.ok(salesOrderService.updateOrder(id, salesOrderDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        salesOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
