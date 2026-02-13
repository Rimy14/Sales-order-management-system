package com.spil.salesorder.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;
    
    private String note;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal taxRate;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal exclAmount;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal taxAmount;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal inclAmount;
}
