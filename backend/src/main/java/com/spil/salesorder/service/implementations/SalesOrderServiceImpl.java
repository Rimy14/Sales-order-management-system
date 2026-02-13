package com.spil.salesorder.service.implementations;

import com.spil.salesorder.domain.entity.Client;
import com.spil.salesorder.domain.entity.Item;
import com.spil.salesorder.domain.entity.SalesOrder;
import com.spil.salesorder.domain.entity.SalesOrderItem;
import com.spil.salesorder.dto.SalesOrderDTO;
import com.spil.salesorder.dto.SalesOrderItemDTO;
import com.spil.salesorder.repository.ClientRepository;
import com.spil.salesorder.repository.ItemRepository;
import com.spil.salesorder.repository.SalesOrderRepository;
import com.spil.salesorder.service.interfaces.SalesOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SalesOrderServiceImpl implements SalesOrderService {
    
    private final SalesOrderRepository salesOrderRepository;
    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<SalesOrderDTO> getAllOrders() {
        return salesOrderRepository.findAllByOrderByCreatedDateDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public SalesOrderDTO getOrderById(Long id) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found with id: " + id));
        return convertToDTO(salesOrder);
    }
    
    @Override
    public SalesOrderDTO createOrder(SalesOrderDTO salesOrderDTO) {
        SalesOrder salesOrder = new SalesOrder();
        populateSalesOrder(salesOrder, salesOrderDTO);
        
        SalesOrder savedOrder = salesOrderRepository.save(salesOrder);
        return convertToDTO(savedOrder);
    }
    
    @Override
    public SalesOrderDTO updateOrder(Long id, SalesOrderDTO salesOrderDTO) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sales Order not found with id: " + id));
        
        // Clear existing items
        salesOrder.getItems().clear();
        
        // Populate with new data
        populateSalesOrder(salesOrder, salesOrderDTO);
        
        SalesOrder updatedOrder = salesOrderRepository.save(salesOrder);
        return convertToDTO(updatedOrder);
    }
    
    @Override
    public void deleteOrder(Long id) {
        if (!salesOrderRepository.existsById(id)) {
            throw new RuntimeException("Sales Order not found with id: " + id);
        }
        salesOrderRepository.deleteById(id);
    }
    
    private void populateSalesOrder(SalesOrder salesOrder, SalesOrderDTO dto) {
        // Set basic fields
        salesOrder.setInvoiceNo(dto.getInvoiceNo());
        salesOrder.setInvoiceDate(dto.getInvoiceDate());
        salesOrder.setReferenceNo(dto.getReferenceNo());
        
        // Set client
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + dto.getClientId()));
        salesOrder.setClient(client);
        
        // Set address fields
        salesOrder.setAddress1(dto.getAddress1());
        salesOrder.setAddress2(dto.getAddress2());
        salesOrder.setAddress3(dto.getAddress3());
        salesOrder.setState(dto.getState());
        salesOrder.setPostCode(dto.getPostCode());
        
        // Process items
        BigDecimal totalExcl = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalIncl = BigDecimal.ZERO;
        
        for (SalesOrderItemDTO itemDTO : dto.getItems()) {
            Item item = itemRepository.findById(itemDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemDTO.getItemId()));
            
            SalesOrderItem orderItem = new SalesOrderItem();
            orderItem.setItem(item);
            orderItem.setNote(itemDTO.getNote());
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPrice(itemDTO.getPrice());
            orderItem.setTaxRate(itemDTO.getTaxRate());
            orderItem.setExclAmount(itemDTO.getExclAmount());
            orderItem.setTaxAmount(itemDTO.getTaxAmount());
            orderItem.setInclAmount(itemDTO.getInclAmount());
            
            salesOrder.addItem(orderItem);
            
            totalExcl = totalExcl.add(itemDTO.getExclAmount());
            totalTax = totalTax.add(itemDTO.getTaxAmount());
            totalIncl = totalIncl.add(itemDTO.getInclAmount());
        }
        
        salesOrder.setTotalExclAmount(totalExcl);
        salesOrder.setTotalTaxAmount(totalTax);
        salesOrder.setTotalInclAmount(totalIncl);
    }
    
    private SalesOrderDTO convertToDTO(SalesOrder salesOrder) {
        SalesOrderDTO dto = new SalesOrderDTO();
        dto.setId(salesOrder.getId());
        dto.setInvoiceNo(salesOrder.getInvoiceNo());
        dto.setInvoiceDate(salesOrder.getInvoiceDate());
        dto.setReferenceNo(salesOrder.getReferenceNo());
        dto.setClientId(salesOrder.getClient().getId());
        dto.setCustomerName(salesOrder.getClient().getCustomerName());
        dto.setAddress1(salesOrder.getAddress1());
        dto.setAddress2(salesOrder.getAddress2());
        dto.setAddress3(salesOrder.getAddress3());
        dto.setState(salesOrder.getState());
        dto.setPostCode(salesOrder.getPostCode());
        dto.setTotalExclAmount(salesOrder.getTotalExclAmount());
        dto.setTotalTaxAmount(salesOrder.getTotalTaxAmount());
        dto.setTotalInclAmount(salesOrder.getTotalInclAmount());
        dto.setCreatedDate(salesOrder.getCreatedDate());
        dto.setLastModifiedDate(salesOrder.getLastModifiedDate());
        
        List<SalesOrderItemDTO> itemDTOs = salesOrder.getItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList());
        dto.setItems(itemDTOs);
        
        return dto;
    }
    
    private SalesOrderItemDTO convertItemToDTO(SalesOrderItem orderItem) {
        SalesOrderItemDTO dto = new SalesOrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setItemId(orderItem.getItem().getId());
        dto.setItemCode(orderItem.getItem().getItemCode());
        dto.setDescription(orderItem.getItem().getDescription());
        dto.setNote(orderItem.getNote());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setTaxRate(orderItem.getTaxRate());
        dto.setExclAmount(orderItem.getExclAmount());
        dto.setTaxAmount(orderItem.getTaxAmount());
        dto.setInclAmount(orderItem.getInclAmount());
        return dto;
    }
}
