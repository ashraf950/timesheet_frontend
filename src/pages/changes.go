
import (
	"errors"
	"fmt"
	"time"
)

// Predefined errors
var (
	ErrItemNotFound      = errors.New("item not found")
	ErrItemAlreadyExists = errors.New("item already exists")
	ErrInvalidItemName   = errors.New("invalid item name")
	ErrInvalidPrice      = errors.New("invalid price")
	ErrInvalidQuantity   = errors.New("invalid quantity")
	ErrInvalidMinStock   = errors.New("invalid minimum stock")
	ErrInvalidMaxStock   = errors.New("invalid maximum stock")
	ErrInsufficientStock = errors.New("insufficient stock")
	ErrInvalidSKU        = errors.New("invalid SKU")
)

// InventoryManager manages inventory operations
type InventoryManager struct {
	inventory *Inventory
}

// NewInventoryManager creates a new inventory manager
func NewInventoryManager() *InventoryManager {
	return &InventoryManager{
		inventory: NewInventory(),
	}
}

// SetInventory sets the inventory for the manager
func (im *InventoryManager) SetInventory(inv *Inventory) {
	im.inventory = inv
}

// GetInventory returns the current inventory
func (im *InventoryManager) GetInventory() *Inventory {
	return im.inventory
}

// AddItem adds a new item to the inventory
func (im *InventoryManager) AddItem(item *Item) error {
	if item == nil {
		return fmt.Errorf("item cannot be nil")
	}

	if err := item.Validate(); err != nil {
		return err
	}

	if !validateSKU(item.SKU) {
		return ErrInvalidSKU
	}

	// Check if item with same ID or SKU already exists
	for _, existingItem := range im.inventory.Items {
		if existingItem.ID == item.ID || existingItem.SKU == item.SKU {
			return ErrItemAlreadyExists
		}
	}

	item.UpdatedAt = time.Now()
	im.inventory.Items[item.ID] = item
	im.addCategoryIfNotExists(item.Category)
	im.inventory.LastSync = time.Now()
	im.inventory.Version++

	return nil
}

// UpdateItem updates an existing item
func (im *InventoryManager) UpdateItem(itemID string, updates *Item) error {
	item, exists := im.inventory.Items[itemID]
	if !exists {
		return ErrItemNotFound
	}

	if updates.Name != "" {
		item.Name = updates.Name
	}
	if updates.Description != "" {
		item.Description = updates.Description
	}
	if updates.Category != "" {
		oldCategory := item.Category
		item.Category = updates.Category
		im.addCategoryIfNotExists(updates.Category)
		im.removeCategoryIfUnused(oldCategory)
	}
	if updates.Price >= 0 {
		item.Price = updates.Price
	}
	if updates.MinStock >= 0 {
		item.MinStock = updates.MinStock
	}
	if updates.MaxStock >= 0 {
		item.MaxStock = updates.MaxStock
	}
	if updates.Supplier != "" {
		item.Supplier = updates.Supplier
	}
	if updates.SKU != "" {
		if !validateSKU(updates.SKU) {
			return ErrInvalidSKU
		}
		// Check if SKU is already used by another item
		for id, existingItem := range im.inventory.Items {
			if id != itemID && existingItem.SKU == updates.SKU {
				return ErrItemAlreadyExists
			}
		}
		item.SKU = updates.SKU
	}

	item.UpdatedAt = time.Now()
	if err := item.Validate(); err != nil {
		return err
	}

	im.inventory.LastSync = time.Now()
	im.inventory.Version++

	return nil
}

// DeleteItem removes an item from inventory (soft delete)
func (im *InventoryManager) DeleteItem(itemID string) error {
	item, exists := im.inventory.Items[itemID]
	if !exists {
		return ErrItemNotFound
	}

	item.IsActive = false
	item.UpdatedAt = time.Now()
	im.inventory.LastSync = time.Now()
	im.inventory.Version++

	return nil
}

// RemoveItem completely removes an item from inventory
func (im *InventoryManager) RemoveItem(itemID string) error {
	item, exists := im.inventory.Items[itemID]
	if !exists {
		return ErrItemNotFound
	}

	delete(im.inventory.Items, itemID)
	im.removeCategoryIfUnused(item.Category)
	im.inventory.LastSync = time.Now()
	im.inventory.Version++

	return nil
}

// GetItem retrieves an item by ID
func (im *InventoryManager) GetItem(itemID string) (*Item, error) {
	item, exists := im.inventory.Items[itemID]
	if !exists {
		return nil, ErrItemNotFound
	}
	return item, nil
}
