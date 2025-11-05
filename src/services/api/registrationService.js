import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class RegistrationService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('registration_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registered_at_c"}},
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
      console.error("Error fetching registrations:", error?.response?.data?.message || error);
      toast.error("Failed to load registrations");
      return [];
    }
  }

  async create(registrationData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Map form data to database field names, including only updateable fields
      const dbData = {
        event_id_c: parseInt(registrationData.eventId || registrationData.event_id_c),
        user_id_c: registrationData.userId || registrationData.user_id_c || "current-user",
        status_c: registrationData.status || registrationData.status_c || "confirmed",
        registered_at_c: new Date().toISOString()
      };

      const response = await apperClient.createRecord('registration_c', {
        records: [dbData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create registration");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} registrations:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Registration successful!");
          return successful[0].data;
        }
      }

      throw new Error("No successful registration result");
    } catch (error) {
      console.error("Error creating registration:", error?.response?.data?.message || error);
      toast.error("Failed to register for event");
      throw error;
    }
  }

  async getRegistrationCountForEvent(eventId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('registration_c', {
        fields: [{"field": {"Name": "Name"}}],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]},
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["confirmed"]}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      return response.total || 0;
    } catch (error) {
      console.error("Error getting registration count:", error);
      return 0;
    }
  }

  async getWaitlistCountForEvent(eventId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('registration_c', {
        fields: [{"field": {"Name": "Name"}}],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]},
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["waitlist"]}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      return response.total || 0;
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      return 0;
    }
  }

  async getUserRegistrationForEvent(eventId, userId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('registration_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registered_at_c"}}
        ],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [userId]}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error getting user registration:", error);
      return null;
    }
  }

  async getByEventId(eventId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('registration_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registered_at_c"}}
        ],
        where: [{"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      return [];
    }
  }

  async getByUserId(userId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('registration_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "registered_at_c"}}
        ],
        where: [{"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [userId]}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      return [];
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('registration_c', {
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
          console.error(`Failed to delete ${failed.length} registrations:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Registration cancelled successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting registration:", error?.response?.data?.message || error);
      toast.error("Failed to cancel registration");
      return false;
    }
  }
}

export const registrationService = new RegistrationService();