import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

export const useInventoryStore = defineStore('inventory', () => {
  const items = ref([])
  const currentItem = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const notification = ref(null) // { message: '...', type: 'success' | 'error' }

  function setNotification(message, type = 'success') {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, 3000) // Clear after 3 seconds
  }

  async function fetchItems() {
    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('inventario')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      items.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function addItem(newItem) {
    loading.value = true
    error.value = null
    try {
      // Check for duplicate serial number
      if (newItem.numero_serie) {
        const { data: existingItems, error: fetchError } = await supabase
          .from('inventario')
          .select('id')
          .eq('numero_serie', newItem.numero_serie)

        if (fetchError) throw fetchError

        if (existingItems && existingItems.length > 0) {
          setNotification('El número de serie ya está registrado.', 'error')
          return null // Prevent insertion
        }
      }

      const { data, error: supabaseError } = await supabase
        .from('inventario')
        .insert(newItem)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      items.value.unshift(data)
      setNotification('Artículo añadido correctamente.', 'success')
      return data
    } catch (e) {
      error.value = e.message
      setNotification(`Error al añadir el artículo: ${e.message}`, 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchItemById(id) {
    console.log('Fetching item with ID:', id);
    loading.value = true
    error.value = null
    currentItem.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('inventario')
        .select('*')
        .eq('id', parseInt(id, 10))

      if (supabaseError) throw supabaseError
      currentItem.value = data ? data[0] : null
      return data ? data[0] : null
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id) {
    loading.value = true
    error.value = null
    try {
      const { error: supabaseError } = await supabase
        .from('inventario')
        .delete()
        .eq('id', parseInt(id, 10))

      if (supabaseError) throw supabaseError

      items.value = items.value.filter(item => item.id !== id)
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateItem(id, updates) {
    console.log('Updating item with ID:', id, 'and updates:', updates);
    loading.value = true
    error.value = null
    try {
      // Check for duplicate serial number for other items
      if (updates.numero_serie) {
        const { data: existingItems, error: fetchError } = await supabase
          .from('inventario')
          .select('id')
          .eq('numero_serie', updates.numero_serie)
          .neq('id', parseInt(id, 10)) // Exclude the current item

        if (fetchError) throw fetchError

        if (existingItems && existingItems.length > 0) {
          setNotification('El número de serie ya está registrado en otro artículo.', 'error')
          return null // Prevent update
        }
      }

      // Remove id and created_at from updates as they should not be updated
      const updatesToSend = { ...updates };
      delete updatesToSend.id;
      delete updatesToSend.created_at;
      console.log('Updates sent to Supabase:', updatesToSend);

      const { data, error: supabaseError } = await supabase
        .from('inventario')
        .update(updatesToSend)
        .eq('id', parseInt(id, 10))
        .select()

      if (supabaseError) {
        console.error('Supabase update error:', supabaseError);
        throw supabaseError;
      }
      console.log('Supabase update data:', data);

      const updatedItem = data ? data[0] : null;

      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      setNotification('Artículo actualizado correctamente.', 'success')
      return updatedItem
    } catch (e) {
      console.error('Error in updateItem:', e);
      error.value = e.message
      setNotification(`Error al actualizar el artículo: ${e.message}`, 'error')
      return null
    } finally {
      loading.value = false
    }
  }

  return { items, currentItem, loading, error, notification, fetchItems, addItem, fetchItemById, deleteItem, updateItem, setNotification }
})