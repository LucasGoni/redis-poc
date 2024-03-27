import { Request, Response, NextFunction } from 'express';

export function validateSearchParams(req: Request, res: Response, next: NextFunction) {
    const { q, from, to, sortBy } = req.query;

    // Validate 'q' parameter
    if (!q || typeof q !== 'string' || q.length < 5 || !/^[a-zA-Z]+$/.test(q)) {
        return res.status(400).json({ error: 'Invalid query parameter: q' });
    }

    // Validate 'from' parameter
    if (from && !isValidDate(from as string)) {
        return res.status(400).json({ error: 'Invalid query parameter: from' });
    }

    // Validate 'to' parameter
    if (to && !isValidDate(to as string)) {
        return res.status(400).json({ error: 'Invalid query parameter: to' });
    }

    // Validate 'sortBy' parameter
    const validSortByValues = ['Relevancy', 'Popularity', 'Published At'];
    if (sortBy && !validSortByValues.includes(sortBy as string)) {
        return res.status(400).json({ error: 'Invalid query parameter: sortBy' });
    }

    // If all validations pass, proceed to the next middleware/route handler
    next();
}

// Helper function to validate date format
function isValidDate(dateString: string): boolean {
    // Check if dateString is a valid date in YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
}
