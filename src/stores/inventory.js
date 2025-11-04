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
      // Verificar si el número de serie o de importación ya existen
      const { data: existingItems, error: selectError } = await supabase
        .from('inventario')
        .select('numero_serie, numero_importacion')
        .or(`numero_serie.eq.${newItem.numero_serie},numero_importacion.eq.${newItem.numero_importacion}`)

      if (selectError) {
        throw selectError
      }

      if (existingItems && existingItems.length > 0) {
        const isSerialDuplicate = existingItems.some(item => item.numero_serie === newItem.numero_serie);
        const isImportDuplicate = existingItems.some(item => item.numero_importacion === newItem.numero_importacion);

        if (isSerialDuplicate) {
          setNotification('El número de serie ya existe.', 'error');
          return null;
        }
        if (isImportDuplicate) {
          setNotification('El número de importación ya existe.', 'error');
          return null;
        }
      }

      const { data, error: supabaseError } = await supabase
        .from('inventario')
        .insert(newItem)
        .select()
        .single()

      if (supabaseError) throw supabaseError

      items.value.unshift(data)
      setNotification('Artículo añadido con éxito.', 'success')
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
      // Construir una lista de filtros para la consulta OR
      const orFilters = [];
      if (updates.numero_serie) {
        orFilters.push(`numero_serie.eq.${updates.numero_serie}`);
      }
      if (updates.numero_importacion) {
        orFilters.push(`numero_importacion.eq.${updates.numero_importacion}`);
      }

      // Solo ejecutar la verificación si hay algo que verificar
      if (orFilters.length > 0) {
        const { data: existingItems, error: selectError } = await supabase
          .from('inventario')
          .select('id, numero_serie, numero_importacion')
          .neq('id', parseInt(id, 10)) // Excluir el artículo actual
          .or(orFilters.join(','));

        if (selectError) {
          throw selectError;
        }

        if (existingItems && existingItems.length > 0) {
          // Cualquier artículo encontrado es un duplicado en otro registro
          const isSerialDuplicate = existingItems.some(item => item.numero_serie === updates.numero_serie);
          const isImportDuplicate = existingItems.some(item => item.numero_importacion === updates.numero_importacion);

          if (isSerialDuplicate) {
            setNotification('El número de serie ya existe en otro artículo.', 'error');
            return null;
          }
          if (isImportDuplicate) {
            setNotification('El número de importación ya existe en otro artículo.', 'error');
            return null;
          }
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
      setNotification('Artículo actualizado con éxito.', 'success');
      return updatedItem
    } catch (e) {
      console.error('Error in updateItem:', e);
      error.value = e.message
      setNotification(`Error al actualizar el artículo: ${e.message}`, 'error');
      return null
    } finally {
      loading.value = false
    }
  }

  return { items, currentItem, loading, error, notification, fetchItems, addItem, fetchItemById, deleteItem, updateItem, setNotification }
})