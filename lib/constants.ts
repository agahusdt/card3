/**
 * Proje genelinde kullanılan sabit değerler
 */

// Token fiyatı (USD)
export const TOKEN_PRICE = 4.78;

// Application names
export const APP_NAME = "GROK Coin Sale";
export const APP_DESCRIPTION = "Official GROK Coin presale platform";

// Domain değeri
export const APP_DOMAIN = "grokcoinsale.com";

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: "https://twitter.com/GrokelonOrg",
  TELEGRAM: "https://t.me/GrokelonOrg",
  WEBSITE: "https://groksale.com"
};

// API error messages
export const API_ERRORS = {
  UNAUTHORIZED: "Unauthorized access",
  INVALID_TOKEN: "Invalid token",
  USER_NOT_FOUND: "User not found",
  ADMIN_NOT_FOUND: "Admin not found"
};

// Status values
export const STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED", 
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED"
};

// Transaction types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  TRANSFER: 'TRANSFER',
  BONUS: 'BONUS',
  REFERRAL: 'REFERRAL',
  ADJUSTMENT: 'ADJUSTMENT',
  INTEREST: 'INTEREST',
  FEE: 'FEE',
  OTHER: 'OTHER',
}

/**
 * Standardize API response structure
 */
export const apiResponse = {
  success: (data: any = {}, message: string = 'Success', status: number = 200) => {
    return new Response(JSON.stringify({
      success: true,
      message,
      data
    }), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  error: (error: string = 'An error occurred', status: number = 400, data: any = {}) => {
    return new Response(JSON.stringify({
      success: false,
      error,
      data
    }), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
  redirect: (url: string, status: number = 302) => {
    return new Response(null, {
      status,
      headers: {
        'Location': url
      }
    });
  },
  
  nextResponse: {
    success: (data: any = {}, message: string = 'Success', status: number = 200) => {
      return Response.json({
        success: true,
        message,
        data
      }, { status });
    },
    
    error: (error: string = 'An error occurred', status: number = 400, data: any = {}) => {
      return Response.json({
        success: false,
        error,
        data
      }, { status });
    }
  }
}; 