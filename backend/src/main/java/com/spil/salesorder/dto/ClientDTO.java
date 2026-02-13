package com.spil.salesorder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    private Long id;
    private String customerName;
    private String address1;
    private String address2;
    private String address3;
    private String state;
    private String postCode;
}
