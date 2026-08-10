/**
 * Middleware to validate MongoDB ObjectID
 * Prevents NoSQL injection attacks
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // MongoDB ObjectID is 24 hex characters
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    
    if (!id || !objectIdPattern.test(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
    }
    
    next();
  };
};

/**
 * Validate multiple ObjectIDs in request body
 */
export const validateObjectIds = (fields = []) => {
  return (req, res, next) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    
    for (const field of fields) {
      let value = req.body[field];

      if (typeof value === 'string') {
        const trimmed = value.trim();
        // Try to parse JSON stringified arrays/objects
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // leave as string if parse fails
          }
        }
      }

      if (value) {
        // Handle array of IDs or objects containing IDs
        if (Array.isArray(value)) {
          const normalized = value.map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') return String(item._id ?? item.id ?? '');
            return '';
          });
          const invalidIds = normalized.filter(id => !objectIdPattern.test(id));
          if (invalidIds.length > 0) {
            return res.status(400).json({
              success: false,
              message: `Invalid ${field} format: contains invalid ObjectIDs`,
              invalidIds,
            });
          }
        }
        // Handle single ID
        else {
          const rawValue = typeof value === 'object' && value !== null ? String(value._id ?? value.id ?? '') : String(value);
          if (!objectIdPattern.test(rawValue)) {
            return res.status(400).json({
              success: false,
              message: `Invalid ${field} format`,
            });
          }
        }
      }
    }
    
    next();
  };
};
