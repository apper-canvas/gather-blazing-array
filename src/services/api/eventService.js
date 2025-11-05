import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class EventService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('event_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching events:", error?.response?.data?.message || error);
      toast.error("Failed to load events");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('event_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Event not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error?.response?.data?.message || error);
      toast.error("Event not found");
      throw error;
    }
  }

  async create(eventData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Map form data to database field names, including only updateable fields
      const dbData = {
        title_c: eventData.title || eventData.title_c,
        description_c: eventData.description || eventData.description_c,
        category_c: eventData.category || eventData.category_c,
        date_c: eventData.date || eventData.date_c,
        start_time_c: eventData.startTime || eventData.start_time_c,
        end_time_c: eventData.endTime || eventData.end_time_c,
        location_c: eventData.location || eventData.location_c,
        capacity_c: parseInt(eventData.capacity || eventData.capacity_c),
        image_url_c: eventData.imageUrl || eventData.image_url_c || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        is_featured_c: eventData.isFeatured || eventData.is_featured_c || false,
        organizer_id_c: eventData.organizerId || eventData.organizer_id_c || "current-user"
      };

      const response = await apperClient.createRecord('event_c', {
        records: [dbData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create event");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} events:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Event created successfully!");
          return successful[0].data;
        }
      }

      throw new Error("No successful creation result");
    } catch (error) {
      console.error("Error creating event:", error?.response?.data?.message || error);
      toast.error("Failed to create event");
      throw error;
    }
  }

  async update(id, eventData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Map form data to database field names, including only updateable fields
      const dbData = {
        Id: parseInt(id),
        title_c: eventData.title || eventData.title_c,
        description_c: eventData.description || eventData.description_c,
        category_c: eventData.category || eventData.category_c,
        date_c: eventData.date || eventData.date_c,
        start_time_c: eventData.startTime || eventData.start_time_c,
        end_time_c: eventData.endTime || eventData.end_time_c,
        location_c: eventData.location || eventData.location_c,
        capacity_c: parseInt(eventData.capacity || eventData.capacity_c),
        image_url_c: eventData.imageUrl || eventData.image_url_c || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        is_featured_c: eventData.isFeatured || eventData.is_featured_c || false,
        organizer_id_c: eventData.organizerId || eventData.organizer_id_c || "current-user"
      };

      const response = await apperClient.updateRecord('event_c', {
        records: [dbData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update event");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} events:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Event updated successfully!");
          return successful[0].data;
        }
      }

      throw new Error("No successful update result");
    } catch (error) {
      console.error("Error updating event:", error?.response?.data?.message || error);
      toast.error("Failed to update event");
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('event_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} events:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Event deleted successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting event:", error?.response?.data?.message || error);
      toast.error("Failed to delete event");
      return false;
    }
  }
}

export const eventService = new EventService();