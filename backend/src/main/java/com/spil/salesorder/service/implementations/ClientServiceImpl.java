package com.spil.salesorder.service.implementations;

import com.spil.salesorder.domain.entity.Client;
import com.spil.salesorder.dto.ClientDTO;
import com.spil.salesorder.repository.ClientRepository;
import com.spil.salesorder.service.interfaces.ClientService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientServiceImpl implements ClientService {
    
    private final ClientRepository clientRepository;
    private final ModelMapper modelMapper;
    
    @Override
    @Transactional(readOnly = true)
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(client -> modelMapper.map(client, ClientDTO.class))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
        return modelMapper.map(client, ClientDTO.class);
    }
    
    @Override
    public ClientDTO createClient(ClientDTO clientDTO) {
        Client client = modelMapper.map(clientDTO, Client.class);
        Client savedClient = clientRepository.save(client);
        return modelMapper.map(savedClient, ClientDTO.class);
    }
    
    @Override
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
        
        client.setCustomerName(clientDTO.getCustomerName());
        client.setAddress1(clientDTO.getAddress1());
        client.setAddress2(clientDTO.getAddress2());
        client.setAddress3(clientDTO.getAddress3());
        client.setState(clientDTO.getState());
        client.setPostCode(clientDTO.getPostCode());
        
        Client updatedClient = clientRepository.save(client);
        return modelMapper.map(updatedClient, ClientDTO.class);
    }
    
    @Override
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client not found with id: " + id);
        }
        clientRepository.deleteById(id);
    }
}
