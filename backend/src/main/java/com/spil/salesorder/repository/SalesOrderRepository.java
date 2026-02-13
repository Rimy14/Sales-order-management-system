package com.spil.salesorder.repository;

import com.spil.salesorder.domain.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    Optional<SalesOrder> findByInvoiceNo(String invoiceNo);
    List<SalesOrder> findAllByOrderByCreatedDateDesc();
}
