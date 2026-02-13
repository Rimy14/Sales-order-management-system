package com.spil.salesorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderDTO {
    private Long id;
    private String invoiceNo;
    private LocalDate invoiceDate;
    private String referenceNo;
    private Long clientId;
    private String customerName;
    private String address1;
    private String address2;
    private String address3;
    private String state;
    private String postCode;
    private List<SalesOrderItemDTO> items = new ArrayList<>();
    private BigDecimal totalExclAmount;
    private BigDecimal totalTaxAmount;
    private BigDecimal totalInclAmount;
    private LocalDate createdDate;
    private LocalDate lastModifiedDate;
}
