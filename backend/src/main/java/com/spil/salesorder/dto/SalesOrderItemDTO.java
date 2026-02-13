package com.spil.salesorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesOrderItemDTO {
    private Long id;
    private Long itemId;
    private String itemCode;
    private String description;
    private String note;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal taxRate;
    private BigDecimal exclAmount;
    private BigDecimal taxAmount;
    private BigDecimal inclAmount;
}
