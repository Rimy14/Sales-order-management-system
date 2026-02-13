package com.spil.salesorder.service.implementations;

import com.spil.salesorder.domain.entity.Item;
import com.spil.salesorder.dto.ItemDTO;
import com.spil.salesorder.repository.ItemRepository;
import com.spil.salesorder.service.interfaces.ItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemServiceImpl implements ItemService {
    
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;
    
    @Override
    @Transactional(readOnly = true)
    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(item -> modelMapper.map(item, ItemDTO.class))
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ItemDTO getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        return modelMapper.map(item, ItemDTO.class);
    }
    
    @Override
    public ItemDTO createItem(ItemDTO itemDTO) {
        Item item = modelMapper.map(itemDTO, Item.class);
        Item savedItem = itemRepository.save(item);
        return modelMapper.map(savedItem, ItemDTO.class);
    }
    
    @Override
    public ItemDTO updateItem(Long id, ItemDTO itemDTO) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        item.setItemCode(itemDTO.getItemCode());
        item.setDescription(itemDTO.getDescription());
        item.setPrice(itemDTO.getPrice());
        
        Item updatedItem = itemRepository.save(item);
        return modelMapper.map(updatedItem, ItemDTO.class);
    }
    
    @Override
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }
}
