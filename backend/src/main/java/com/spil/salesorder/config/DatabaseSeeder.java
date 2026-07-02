package com.spil.salesorder.config;

import com.spil.salesorder.domain.entity.Client;
import com.spil.salesorder.domain.entity.Item;
import com.spil.salesorder.repository.ClientRepository;
import com.spil.salesorder.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;

    public DatabaseSeeder(ClientRepository clientRepository, ItemRepository itemRepository) {
        this.clientRepository = clientRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (clientRepository.count() == 0) {
            seedClients();
        }
        if (itemRepository.count() == 0) {
            seedItems();
        }
    }

    private void seedClients() {
        Client c1 = new Client(null, "ABC Corporation", "123 Main Street", "Building A", "Floor 5", "California", "90001");
        Client c2 = new Client(null, "XYZ Ltd", "456 Park Avenue", "Suite 200", "", "New York", "10001");
        Client c3 = new Client(null, "Global Traders Inc", "789 Business Blvd", "Tower B", "Office 301", "Texas", "75001");
        Client c4 = new Client(null, "Tech Solutions Pvt Ltd", "321 Tech Park", "Block C", "", "Washington", "98001");
        Client c5 = new Client(null, "Green Earth Co", "654 Eco Street", "Unit 12", "", "Oregon", "97001");
        clientRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5));
    }

    private void seedItems() {
        Item i1 = new Item(null, "ITM001", "Laptop - Dell Latitude 5420", new BigDecimal("1200.00"));
        Item i2 = new Item(null, "ITM002", "Desktop Computer - HP ProDesk", new BigDecimal("850.00"));
        Item i3 = new Item(null, "ITM003", "Monitor - 27 inch LED", new BigDecimal("300.00"));
        Item i4 = new Item(null, "ITM004", "Keyboard - Wireless", new BigDecimal("45.00"));
        Item i5 = new Item(null, "ITM005", "Mouse - Optical Wireless", new BigDecimal("25.00"));
        Item i6 = new Item(null, "ITM006", "Printer - Laser Multifunction", new BigDecimal("450.00"));
        Item i7 = new Item(null, "ITM007", "Office Chair - Ergonomic", new BigDecimal("280.00"));
        Item i8 = new Item(null, "ITM008", "Desk - Standing Adjustable", new BigDecimal("650.00"));
        Item i9 = new Item(null, "ITM009", "USB Hub - 7 Port", new BigDecimal("35.00"));
        Item i10 = new Item(null, "ITM010", "Webcam - HD 1080p", new BigDecimal("85.00"));
        itemRepository.saveAll(Arrays.asList(i1, i2, i3, i4, i5, i6, i7, i8, i9, i10));
    }
}
