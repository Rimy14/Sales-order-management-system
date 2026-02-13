package com.spil.salesorder.service.interfaces;

import com.spil.salesorder.dto.ItemDTO;

import java.util.List;

public interface ItemService {
    List<ItemDTO> getAllItems();
    ItemDTO getItemById(Long id);
    ItemDTO createItem(ItemDTO itemDTO);
    ItemDTO updateItem(Long id, ItemDTO itemDTO);
    void deleteItem(Long id);
}
