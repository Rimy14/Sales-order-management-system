package com.spil.salesorder.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String invoiceNo;
    
    @Column(nullable = false)
    private LocalDate invoiceDate;
    
    private String referenceNo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    private String address1;
    private String address2;
    private String address3;
    private String state;
    private String postCode;
    
    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesOrderItem> items = new ArrayList<>();
    
    @Column(precision = 12, scale = 2)
    private BigDecimal totalExclAmount;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal totalTaxAmount;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal totalInclAmount;
    
    @Column(nullable = false, updatable = false)
    private LocalDate createdDate;
    
    private LocalDate lastModifiedDate;
    
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDate.now();
        lastModifiedDate = LocalDate.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastModifiedDate = LocalDate.now();
    }
    
    public void addItem(SalesOrderItem item) {
        items.add(item);
        item.setSalesOrder(this);
    }
    
    public void removeItem(SalesOrderItem item) {
        items.remove(item);
        item.setSalesOrder(null);
    }
}
