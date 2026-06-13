/**
 * AUTO-GENERATED from the Toolshop OpenAPI document. DO NOT EDIT.
 * Regenerate with: npm run generate:types
 */
export interface paths {
    "/brands": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all brands
         * @description Retrieve all brands
         */
        get: operations["getBrands"];
        put?: never;
        /**
         * Store new brand
         * @description Store new brand
         */
        post: operations["storeBrand"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/brands/{brandId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific brand
         * @description Retrieve specific brand
         */
        get: operations["getBrand"];
        /**
         * Update specific brand
         * @description Update specific brand
         */
        put: operations["updateBrand"];
        post?: never;
        /**
         * Delete specific brand
         * @description Admin role is required to delete a specific brand
         */
        delete: operations["deleteBrand"];
        options?: never;
        head?: never;
        /**
         * Partially update specific brand
         * @description Partially update specific brand
         */
        patch: operations["patchBrand"];
        trace?: never;
    };
    "/brands/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific brands matching the search query
         * @description Search is performed on the `name` column
         */
        get: operations["searchBrand"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a new cart
         * @description Create a new cart
         */
        post: operations["createCart"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/{cartId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific cart
         * @description Retrieve specific cart
         */
        get: operations["getCart"];
        put?: never;
        post?: never;
        /**
         * Delete Cart
         * @description Delete Cart
         */
        delete: operations["deleteCart"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/{cartId}/product/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete product from cart
         * @description Delete a product from Cart
         */
        delete: operations["deleteProductFromCart"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/{cartId}/product/quantity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update quantity of item in cart
         * @description Update quantity of item in cart
         */
        put: operations["updateCartQuantity"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/carts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add item to cart
         * @description Add item to cart
         */
        post: operations["addItem"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all categories
         * @description Retrieve all categories
         */
        get: operations["getCategories"];
        put?: never;
        /**
         * Store new category
         * @description Store new category
         */
        post: operations["storeCategory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/{categoryId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update specific category
         * @description Update specific category
         */
        put: operations["updateCategory"];
        post?: never;
        /**
         * Delete specific category
         * @description Admin role is required to delete a specific category
         */
        delete: operations["deleteCategory"];
        options?: never;
        head?: never;
        /**
         * Partially update specific category
         * @description Partially update specific category
         */
        patch: operations["patchCategory"];
        trace?: never;
    };
    "/categories/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific categories matching the search query
         * @description Search is performed on the `name` column
         */
        get: operations["searchCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/tree": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all categories (including subcategories)
         * @description Retrieve all categories (including subcategories)
         */
        get: operations["getCategoriesTree"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories/tree/{categoryId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific category (including subcategories)
         * @description Retrieve specific category (including subcategories)
         */
        get: operations["getCategory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/favorites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all favorites
         * @description User role is required to retrieve users favorites
         */
        get: operations["getFavorites"];
        put?: never;
        /**
         * Store new favorite
         * @description User role is required to store new favorite
         */
        post: operations["storeFavorite"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/favorites/{favoriteId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific favorite
         * @description User role is required to retrieve specific favorite
         */
        get: operations["getFavorite"];
        put?: never;
        post?: never;
        /**
         * Delete specific favorite
         * @description User role is required to delete a specific favorite
         */
        delete: operations["deleteFavorite"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/images": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all images
         * @description Retrieve all images
         */
        get: operations["getImages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all invoices
         * @description `admin` retrieves all invoices, `user` retrieves only related invoices
         */
        get: operations["getInvoices"];
        put?: never;
        /**
         * Store new invoice
         * @description Store new invoice
         */
        post: operations["storeInvoice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{invoice_number}/download-pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download already generated PDF of a specific invoice
         * @description Download already generated PDF of a specific invoice
         */
        get: operations["downloadPDF"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{invoice_number}/download-pdf-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve the status of the PDF.
         * @description Retrieve the status of the PDF. The status can be INITIATED, IN_PROGRESS, COMPLETED
         */
        get: operations["downloadPDFStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/{invoiceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific invoice
         * @description Retrieve specific invoice
         */
        get: operations["getInvoice"];
        /**
         * Update specific invoice
         * @description Update specific invoice
         */
        put: operations["updateInvoice"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Partially update specific invoice
         * @description Partially update specific invoice
         */
        patch: operations["patchInvoice"];
        trace?: never;
    };
    "/invoices/{invoiceId}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Update invoice status
         * @description Update invoice status
         */
        put: operations["updateInvoiceStatus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/guest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Store new guest invoice
         * @description Store new invoice for guest checkout
         */
        post: operations["storeGuestInvoice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/invoices/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific invoices matching the search query
         * @description Search is performed on the `invoice_number`, `billing_street` and `status` column
         */
        get: operations["searchInvoice"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve messages
         * @description `admin` retrieves all messages, `user` retrieves only related messages
         */
        get: operations["getMessages"];
        put?: never;
        /**
         * Send new contact message
         * @description Send new contact message by mail
         */
        post: operations["sendMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/messages/{messageId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific message
         * @description Retrieve specific message
         */
        get: operations["getMessage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/messages/{messageId}/attach-file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Attach file to contact message
         * @description Attach file to contact message
         */
        post: operations["attachFile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/messages/{messageId}/reply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send new contact message
         * @description Send new contact message by mail
         */
        post: operations["replyToMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/messages/{messageId}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Set a new message status
         * @description Set a new message status. Possible values: `NEW`, `IN_PROGRESS`, `RESOLVED`
         */
        put: operations["updateMessageStatus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payment/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Check payment
         * @description Check payment
         */
        post: operations["checkPayment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/postcode-lookup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Lookup address details by postcode
         * @description Returns street, city and state for a given country/postcode/house number. The underlying source is configurable: a local faker driver (default) or an external HTTP service (e.g. a WireMock stub) when POSTCODE_LOOKUP_DRIVER=http.
         */
        get: operations["postcodeLookup"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/product-specs/names": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve all distinct spec names with their values */
        get: operations["getSpecNames"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all products
         * @description Retrieve all products
         */
        get: operations["getProducts"];
        put?: never;
        /**
         * Store new product
         * @description Store new product
         */
        post: operations["storeProduct"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/{productId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific product
         * @description Retrieve specific product
         */
        get: operations["getProduct"];
        /**
         * Update specific product
         * @description Update specific product
         */
        put: operations["updateProduct"];
        post?: never;
        /**
         * Delete specific product
         * @description Admin role is required to delete a specific product
         */
        delete: operations["deleteProduct"];
        options?: never;
        head?: never;
        /**
         * Partially update specific product
         * @description Partially update specific product
         */
        patch: operations["patchProduct"];
        trace?: never;
    };
    "/products/{productId}/related": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve related products
         * @description Retrieve related products
         */
        get: operations["getRelatedProducts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/{productId}/specs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve specs for a product */
        get: operations["getProductSpecs"];
        put?: never;
        /** Add a spec to a product */
        post: operations["storeProductSpec"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/{productId}/specs/{specId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve a specific spec */
        get: operations["getProductSpec"];
        /** Update a spec */
        put: operations["updateProductSpec"];
        post?: never;
        /** Delete a spec */
        delete: operations["deleteProductSpec"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/products/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific products matching the search query
         * @description Search is performed on the `name` column
         */
        get: operations["searchProduct"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/average-sales-per-month": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get average sales per month
         * @description `Admin` role is required to get average sales per month
         */
        get: operations["getAverageSalesPerMonth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/average-sales-per-week": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get average sales per week
         * @description `Admin` role is required to get average sales per week
         */
        get: operations["getAverageSalesPerWeek"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/customers-by-country": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get customers by country
         * @description `Admin` role is required to get customers by country
         */
        get: operations["getCustomersByCountry"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/top10-best-selling-categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get top 10 best selling categories
         * @description `Admin` role is required to get top 10 best selling categories
         */
        get: operations["getBestSellingCategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/top10-purchased-products": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get top 10 purchased products
         * @description `Admin` role is required to get top 10 purchased products
         */
        get: operations["getTopPurchasedProducts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/total-sales-of-years": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get total sales of years
         * @description `Admin` role is required to get total sales of years
         */
        get: operations["getTotalSalesOfYears"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reports/total-sales-per-country": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get total sales per country
         * @description `Admin` role is required to get total sales per country
         */
        get: operations["getTotalSalesPerCountry"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/totp/setup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Setup TOTP for the authenticated user
         * @description Generates a TOTP secret and QR code URL for the user to scan and enables TOTP setup.
         */
        post: operations["setupTotp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/totp/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Verify TOTP code for the authenticated user
         * @description Validates the submitted TOTP code and enables TOTP if verification is successful.
         */
        post: operations["verifyTotp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve all users
         * @description Retrieve all users
         */
        get: operations["getUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific user
         * @description Retrieve specific user
         */
        get: operations["getUser"];
        /**
         * Update specific user
         * @description Update specific user
         */
        put: operations["updateUser"];
        post?: never;
        /**
         * Delete specific user
         * @description Admin role is required to delete a specific user
         */
        delete: operations["deleteUser"];
        options?: never;
        head?: never;
        /**
         * Partially update specific user
         * @description Partially update specific user
         */
        patch: operations["patchUser"];
        trace?: never;
    };
    "/users/change-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Change password
         * @description Change the existing password to a new one
         */
        post: operations["changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/forgot-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request a new password
         * @description Request a new password, it actually sets the password to `welcome02`
         */
        post: operations["forgotPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login customer */
        post: operations["login-customer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Logout - invalidate the token
         * @description Logout - invalidate the token
         */
        get: operations["logOut"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve current customer info */
        get: operations["get-current-customer-info"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve a refreshed token
         * @description Retrieve a refreshed token
         */
        get: operations["refreshToken"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Store new user
         * @description Store new user
         */
        post: operations["storeUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve specific users matching the search query
         * @description Search is performed on the `first_name`, `last_name`, or `city` column
         */
        get: operations["searchUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        BankTransferDetails: {
            account_name?: string;
            account_number?: string;
            bank_name?: string;
        };
        /** BrandRequest */
        BrandRequest: {
            /** @example new brand */
            name?: string;
            /**
             * @description URL part, words separated by hyphen
             * @example new-brand
             */
            slug?: string;
        };
        /** BrandResponse */
        BrandResponse: {
            id?: string;
            /** @example new brand */
            name?: string;
            /** @example new-brand */
            slug?: string;
        };
        BuyNowPayLaterDetails: {
            monthly_installments?: string;
        };
        /** CartResponse */
        CartItemResponse: {
            id?: string;
        };
        /** CartResponse */
        CartResponse: {
            id?: string;
        };
        /** @description Placeholder for Cash on Delivery payment method */
        CashOnDeliveryDetails: Record<string, never>;
        /** CategoryRequest */
        CategoryRequest: {
            /** @example new category */
            name?: string;
            parent_id?: string | null;
            /**
             * @description URL part, words separated by hyphen
             * @example new-category
             */
            slug?: string;
        };
        /** CategoryResponse */
        CategoryResponse: {
            id?: string;
            /** @example new category */
            name?: string;
            parent_id?: string | null;
            /** @example new-category */
            slug?: string;
            sub_categories?: components["schemas"]["CategoryResponse"][];
        };
        /** CategoryTreeResponse */
        CategoryTreeResponse: {
            id?: string;
            /** @example new category */
            name?: string;
            parent_id?: string | null;
            /** @example new-category */
            slug?: string;
            sub_categories?: components["schemas"]["CategoryResponse"][];
        };
        /** ContactReplyResponse */
        ContactReplyResponse: {
            /** @example 2022-08-01 08:24:56 */
            created_at?: string;
            /** @example 1 */
            id?: string;
            /** @example Reply message */
            message?: string;
            user?: components["schemas"]["UserResponse"];
        };
        /** ContactRequest */
        ContactRequest: {
            /**
             * @description Required when not authenticated
             * @example john@doe.example
             */
            email?: string;
            /** @example Something is wrong with the website. */
            message: string;
            /**
             * @description Sender name
             * @example John Doe
             */
            name?: string;
            /** @example website */
            subject: string;
        };
        /** ContactRequestAuthenticated */
        ContactRequestAuthenticated: {
            /** @example Something is wrong with the website. */
            message?: string;
            /**
             * @description If set, Authorization header is required
             * @example John Doe
             */
            name: string;
            /** @example website */
            subject?: string;
        };
        /** ContactResponse */
        ContactResponse: {
            /** @example 2022-08-01 08:24:56 */
            created_at?: string;
            /** @example john@doe.example */
            email?: string;
            /** @example 1 */
            id?: string;
            /** @example Something is wrong with the website. */
            message?: string;
            /** @example John Doe */
            name?: string;
            /** @example NEW */
            status?: string;
            /** @example website */
            subject?: string;
        };
        /** ContactResponseAuthenticated */
        ContactResponseAuthenticated: {
            /** @example 2022-08-01 08:24:56 */
            created_at?: string;
            /** @example john@doe.example */
            email?: string;
            /** @example 1 */
            id?: string;
            /** @example Something is wrong with the website. */
            message?: string;
            /** @example John Doe */
            name?: string;
            /** @example NEW */
            status?: string;
            /** @example website */
            subject?: string;
            /** @example John Doe */
            user_id?: string;
        };
        /**
         * ContactResponseFull
         * @description A detailed contact message response with user and replies
         */
        ContactResponseFull: {
            /** @example 2025-03-09 09:14:49 */
            created_at?: string;
            /** @example null */
            email?: string;
            /** @example 01jnx2z1a6s8qx9z3hhqy3rdyp */
            id?: string;
            /** @example This is a test contact message. */
            message?: string;
            /** @example null */
            name?: string;
            replies?: components["schemas"]["ContactReplyResponse"][];
            /** @example IN_PROGRESS */
            status?: string;
            /** @example test-subject */
            subject?: string;
            user?: components["schemas"]["UserResponse"];
            /** @example 01JNX24JV5Q3QFDB2ZPTRBMFN8 */
            user_id?: string;
        };
        CreditCardDetails: {
            card_holder_name?: string;
            credit_card_number?: string;
            cvv?: string;
            expiration_date?: string;
        };
        /** DownloadResponse */
        DownloadResponse: {
            filename?: string;
            id?: string;
            name?: string;
            status?: string;
            type?: string;
        };
        /** FavoriteRequest */
        FavoriteRequest: {
            product_id?: string;
        };
        /** FavoriteResponse */
        FavoriteResponse: {
            /** @example 1234 */
            id?: string;
            /** @example 1234 */
            product_id?: string;
            /** @example 1234 */
            user_id?: string;
        };
        /** FavoriteResponse */
        FavoriteWithProductResponse: {
            /** @example 1234 */
            id?: string;
            product?: components["schemas"]["ProductResponse"];
            /** @example 1234 */
            product_id?: string;
            /** @example 1234 */
            user_id?: string;
        };
        GiftCardDetails: {
            gift_card_number?: string;
            validation_code?: string;
        };
        /** ImageResponse */
        ImageResponse: {
            by_name?: string;
            by_url?: string;
            file_name?: string;
            id?: string;
            source_name?: string;
            source_url?: string;
            title?: string;
        };
        /** InvoiceLineResponse */
        InvoiceLineResponse: {
            discount_percentage?: number;
            discounted_price?: number;
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            id?: string;
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            invoice_id?: string;
            product?: components["schemas"]["ProductResponse"];
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            product_id?: string;
            quantity?: number;
            unit_price?: number;
        };
        InvoiceRequest: {
            billing_city: string;
            billing_country: string;
            billing_postal_code: string;
            billing_state: string;
            billing_street: string;
            cart_id: string;
            payment_details: components["schemas"]["BankTransferDetails"] | components["schemas"]["CreditCardDetails"] | components["schemas"]["GiftCardDetails"] | components["schemas"]["BuyNowPayLaterDetails"] | Record<string, never>;
            /** @enum {string} */
            payment_method: "bank-transfer" | "cash-on-delivery" | "credit-card" | "buy-now-pay-later" | "gift-card";
        };
        /** InvoiceResponse */
        InvoiceResponse: {
            additional_discount_amount?: number;
            additional_discount_percentage?: number;
            billing_city?: string;
            billing_country?: string;
            billing_postal_code?: string;
            billing_state?: string;
            billing_street?: string;
            /** @example 2022-08-01 08:24:56 */
            created_at?: string;
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            id?: string;
            /** @example 2022-10-20 09:49:45 */
            invoice_date?: string;
            /** @example INV-2022000002 */
            invoice_number?: string;
            invoicelines?: components["schemas"]["InvoiceLineResponse"][];
            /** @example COMPLETED */
            status?: string;
            /** @example  */
            status_message?: string;
            subtotal?: number;
            total?: number;
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            user_id?: string;
        };
        /** PaymentRequest */
        PaymentRequest: {
            payment_details?: components["schemas"]["BankTransferDetails"] | components["schemas"]["CreditCardDetails"] | components["schemas"]["GiftCardDetails"] | components["schemas"]["BuyNowPayLaterDetails"] | Record<string, never>;
            /** @enum {string} */
            payment_method?: "bank-transfer" | "cash-on-delivery" | "credit-card" | "buy-now-pay-later" | "gift-card";
        };
        /** ProductRequest */
        ProductRequest: {
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            brand_id?: string;
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            category_id?: string;
            /** @example A */
            co2_rating?: string;
            description?: string;
            /** @example 1 */
            is_location_offer?: boolean;
            /** @example 0 */
            is_rental?: boolean;
            name?: string;
            /** @example 1.99 */
            price?: number;
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            product_image_id?: string;
        };
        /** ProductResponse */
        ProductResponse: {
            brand?: components["schemas"]["BrandResponse"];
            category?: components["schemas"]["CategoryResponse"];
            /** @example A */
            co2_rating?: string;
            /** @example Lorum ipsum */
            description?: string;
            /** @example 01JFG8Q5XKZJY4BEYQ87PC2Q1Y */
            id?: string;
            /** @example 0 */
            in_stock?: boolean;
            /** @example true */
            is_eco_friendly?: boolean;
            /** @example 1 */
            is_location_offer?: boolean;
            /** @example 0 */
            is_rental?: boolean;
            /** @example new brand */
            name?: string;
            /** @example 9.99 */
            price?: number;
            product_image?: components["schemas"]["ImageResponse"];
        };
        /** ProductSpecRequest */
        ProductSpecRequest: {
            product_id: string;
            /** @example Weight */
            spec_name: string;
            /** @example kg */
            spec_unit?: string | null;
            /** @example 1.5 */
            spec_value: string;
        };
        /** ProductSpecResponse */
        ProductSpecResponse: {
            id?: string;
            product_id?: string;
            spec_name?: string;
            spec_unit?: string | null;
            spec_value?: string;
        };
        /** UserRequest */
        UserRequest: {
            address?: {
                /** @example City */
                city?: string;
                /** @example Country */
                country?: string;
                /** @example 12 */
                house_number?: string;
                /** @example 1234AA */
                postal_code?: string;
                /** @example State */
                state?: string;
                /** @example Street 1 */
                street?: string;
            };
            /**
             * Format: date
             * @description Must be a valid date between 18 and 75 years ago
             * @example 1970-01-01
             */
            dob?: string;
            /**
             * Format: email
             * @example john@doe.example
             */
            email: string;
            /** @example John */
            first_name: string;
            /** @example Doe */
            last_name: string;
            /**
             * Format: password
             * @description Must include uppercase, lowercase, number, and symbol
             * @example SuperSecure@123
             */
            password: string;
            /** @example 0987654321 */
            phone?: string;
        };
        /** UserResponse */
        UserResponse: {
            address?: {
                /** @example City */
                city?: string;
                /** @example Country */
                country?: string;
                /** @example 12 */
                house_number?: string | null;
                /** @example 1234AA */
                postal_code?: string | null;
                /** @example State */
                state?: string | null;
                /** @example Street 1 */
                street?: string;
            };
            /** @example 2022-08-01 08:24:56 */
            created_at?: string;
            /** @example 1970-01-01 */
            dob?: string;
            /** @example john@doe.example */
            email?: string;
            enabled?: boolean;
            failed_login_attempts?: number | null;
            /** @example John */
            first_name?: string;
            id?: string;
            /** @example Doe */
            last_name?: string;
            /** @example 0987654321 */
            phone?: string | null;
            provider?: string | null;
            totp_enabled?: boolean;
        };
    };
    responses: {
        /** @description Returns when the entity is used elsewhere */
        ConflictResponse: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
        /** @description The resource conflicts with an existing one (e.g. unique slug already taken). Body is either a field-level MessageBag (when caught by validation) or a single message (when caught by the Handler from a race / FormRequest bypass). */
        DuplicateConflictResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    [key: string]: string[];
                } | {
                    /** @example Duplicate Entry */
                    message?: string;
                };
            };
        };
        /** @description Returns when the resource is not found */
        ItemNotFoundResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @example Requested item not found */
                    message?: string;
                };
            };
        };
        /** @description Returns when the method is not allowed for the requested route */
        MethodNotAllowedResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @example Method is not allowed for the requested route */
                    message?: string;
                };
            };
        };
        /** @description Returns when the resource is not found */
        ResourceNotFoundResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @example Resource not found */
                    message?: string;
                };
            };
        };
        /** @description Returns when user is not authenticated */
        UnauthorizedResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @example Unauthorized */
                    message?: string;
                };
            };
        };
        /** @description Returns when the server was not able to process the content */
        UnprocessableEntityResponse: {
            headers: {
                [name: string]: unknown;
            };
            content?: never;
        };
        /** @description Result of the update */
        UpdateResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @example true */
                    success?: boolean;
                };
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getBrands: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"][];
                };
            };
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    storeBrand: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Brand request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["BrandRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getBrand: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The brandId parameter in path
                 * @example 1
                 */
                brandId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    updateBrand: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The brandId parameter in path
                 * @example 1
                 */
                brandId: string;
            };
            cookie?: never;
        };
        /** @description Brand request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["BrandRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    deleteBrand: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The brandId parameter in path
                 * @example 1
                 */
                brandId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["ConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    patchBrand: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The brandId parameter in path
                 * @example 1
                 */
                brandId: string;
            };
            cookie?: never;
        };
        /** @description Partial brand request object. Only fields to be updated should be included. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["BrandRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    searchBrand: {
        parameters: {
            query: {
                /** @description A query phrase */
                q: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BrandResponse"][];
                };
            };
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    createCart: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Create cartId */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1234 */
                        id?: string;
                    };
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getCart: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The cartId parameter in path
                 * @example 1
                 */
                cartId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CartResponse"];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    deleteCart: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The cartId parameter in path
                 * @example 1
                 */
                cartId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["ConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    deleteProductFromCart: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The cartId parameter in path
                 * @example 1
                 */
                cartId: string;
                /**
                 * @description The cartId parameter in path
                 * @example 1
                 */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["ConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    updateCartQuantity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Cart ID */
                cartId: string;
            };
            cookie?: never;
        };
        /** @description Payload to add item to cart */
        requestBody: {
            content: {
                "application/json": {
                    /** @example 01HHJC7RERZ0M3VDGS6X9HM33A */
                    product_id: string;
                    /** @example 1 */
                    quantity: number;
                };
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    addItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Cart ID */
                id: string;
            };
            cookie?: never;
        };
        /** @description Payload to add item to cart */
        requestBody: {
            content: {
                "application/json": {
                    /** @example 01HHJC7RERZ0M3VDGS6X9HM33A */
                    product_id: string;
                    /** @example 1 */
                    quantity: number;
                };
            };
        };
        responses: {
            /** @description Item added */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example item added or updated */
                        result?: string;
                    };
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryResponse"][];
                };
            };
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    storeCategory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Category request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["CategoryRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryResponse"];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    updateCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The categoryId parameter in path
                 * @example 1
                 */
                categoryId: string;
            };
            cookie?: never;
        };
        /** @description Category request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["CategoryRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    deleteCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The categoryId parameter in path
                 * @example 1
                 */
                categoryId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["ConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    patchCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The categoryId parameter in path
                 * @example 1
                 */
                categoryId: string;
            };
            cookie?: never;
        };
        /** @description Partial category request object. Only fields to be updated should be included. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["CategoryRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    searchCategory: {
        parameters: {
            query: {
                /** @description A query phrase */
                q: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryResponse"][];
                };
            };
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getCategoriesTree: {
        parameters: {
            query?: {
                /** @description Parent category slug */
                by_category_slug?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryTreeResponse"][];
                };
            };
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getCategory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The categoryId parameter in path
                 * @example 1
                 */
                categoryId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryTreeResponse"];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getFavorites: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FavoriteWithProductResponse"][];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    storeFavorite: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Brand request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["FavoriteRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FavoriteResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getFavorite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The favoriteId parameter in path
                 * @example 1
                 */
                favoriteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FavoriteResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    deleteFavorite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The favoriteId parameter in path */
                favoriteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["ConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getImages: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImageResponse"][];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getInvoices: {
        parameters: {
            query?: {
                /** @description pagenumber */
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1 */
                        current_page?: number;
                        data?: components["schemas"]["InvoiceResponse"][];
                        /** @example 1 */
                        from?: number;
                        /** @example 1 */
                        last_page?: number;
                        /** @example 1 */
                        per_page?: number;
                        /** @example 1 */
                        to?: number;
                        /** @example 1 */
                        total?: number;
                    };
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    storeInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Invoice request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvoiceRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    downloadPDF: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The invoice_number parameter in path
                 * @example 1
                 */
                invoice_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    downloadPDFStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The invoice_number parameter in path
                 * @example 1
                 */
                invoice_number: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The invoiceId parameter in path
                 * @example 1
                 */
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    updateInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The invoiceId parameter in path */
                invoiceId: string;
            };
            cookie?: never;
        };
        /** @description Invoice request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvoiceRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    patchInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The invoiceId parameter in path */
                invoiceId: string;
            };
            cookie?: never;
        };
        /** @description Partial invoice request object. Only fields to be updated should be included. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvoiceRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    updateInvoiceStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The invoiceId parameter in path */
                invoiceId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @description The status of the order
                     * @enum {string}
                     */
                    status?: "AWAITING_FULFILLMENT" | "ON_HOLD" | "AWAITING_SHIPMENT" | "SHIPPED" | "COMPLETED";
                    /** @description A message describing the status */
                    status_message?: string | null;
                };
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    storeGuestInvoice: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Guest invoice request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvoiceRequest"] & {
                    /**
                     * Format: email
                     * @description Guest email address
                     */
                    guest_email?: string;
                    /** @description Guest first name */
                    guest_first_name?: string;
                    /** @description Guest last name */
                    guest_last_name?: string;
                };
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvoiceResponse"];
                };
            };
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    searchInvoice: {
        parameters: {
            query: {
                /** @description pagenumber */
                page?: number;
                /** @description A query phrase */
                q: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1 */
                        current_page?: number;
                        data?: components["schemas"]["InvoiceResponse"][];
                        /** @example 1 */
                        from?: number;
                        /** @example 1 */
                        last_page?: number;
                        /** @example 1 */
                        per_page?: number;
                        /** @example 1 */
                        to?: number;
                        /** @example 1 */
                        total?: number;
                    };
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getMessages: {
        parameters: {
            query?: {
                /** @description pagenumber */
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1 */
                        current_page?: number;
                        data?: (components["schemas"]["ContactResponse"] | components["schemas"]["ContactResponseAuthenticated"])[];
                        /** @example 1 */
                        from?: number;
                        /** @example 1 */
                        last_page?: number;
                        /** @example 1 */
                        per_page?: number;
                        /** @example 1 */
                        to?: number;
                        /** @example 1 */
                        total?: number;
                    };
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    sendMessage: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Contact request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["ContactRequest"];
            };
        };
        responses: {
            /** @description Result of the insert */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example true */
                        success?: boolean;
                    };
                };
            };
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The messageId parameter in path
                 * @example 1
                 */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContactResponse"] | components["schemas"]["ContactResponseAuthenticated"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    attachFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The messageId parameter in path
                 * @example 1
                 */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /**
                     * Format: binary
                     * @description File
                     */
                    file?: string;
                };
            };
        };
        responses: {
            /** @description Result of the file upload */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example true */
                        success?: boolean;
                    };
                };
            };
            404: components["responses"]["ResourceNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    replyToMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The messageId parameter in path
                 * @example 1
                 */
                messageId: string;
            };
            cookie?: never;
        };
        /** @description Contact request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["ContactRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContactReplyResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    updateMessageStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The messageId parameter in path
                 * @example 1
                 */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /**
                     * @example IN_PROGRESS
                     * @enum {string}
                     */
                    status?: "NEW" | "ON_HOLD" | "IN_PROGRESS" | "RESOLVED";
                };
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    checkPayment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Payment request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["PaymentRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Success status */
                        message?: string;
                    };
                };
            };
        };
    };
    postcodeLookup: {
        parameters: {
            query: {
                country: string;
                house_number?: string;
                postcode: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Address details */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        city?: string;
                        country?: string;
                        house_number?: string;
                        postcode?: string;
                        state?: string;
                        street?: string;
                    };
                };
            };
            422: components["responses"]["UnprocessableEntityResponse"];
            /** @description Upstream lookup failure */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getSpecNames: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getProducts: {
        parameters: {
            query?: {
                /** @description Can be used to define a price range, like: price,10,30 */
                between?: string;
                /** @description Id of brand */
                by_brand?: string;
                /** @description Id of category */
                by_category?: string;
                /** @description Indication if we like to retrieve rentals products */
                is_rental?: string;
                /** @description pagenumber */
                page?: number;
                /** @description Can be used to sort based on specific column value, like: name,asc OR name,desc OR price,asc OR price,desc */
                sort?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1 */
                        current_page?: number;
                        data?: components["schemas"]["ProductResponse"][];
                        /** @example 1 */
                        from?: number;
                        /** @example 1 */
                        last_page?: number;
                        /** @example 1 */
                        per_page?: number;
                        /** @example 1 */
                        to?: number;
                        /** @example 1 */
                        total?: number;
                    };
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    storeProduct: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Product request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResponse"];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The productId parameter in path
                 * @example 1
                 */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResponse"];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    updateProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The productId parameter in path */
                productId: string;
            };
            cookie?: never;
        };
        /** @description Product request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    deleteProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The productId parameter in path */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["ConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    patchProduct: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The productId parameter in path */
                productId: string;
            };
            cookie?: never;
        };
        /** @description Partial product request object. Only fields to be updated should be included. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProductRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getRelatedProducts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The productId parameter in path
                 * @example 1
                 */
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductResponse"][];
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getProductSpecs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductSpecResponse"][];
                };
            };
        };
    };
    storeProductSpec: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @example Weight */
                    spec_name: string;
                    /** @example kg */
                    spec_unit?: string | null;
                    /** @example 1.5 */
                    spec_value: string;
                };
            };
        };
        responses: {
            /** @description Spec created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductSpecResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    getProductSpec: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
                specId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProductSpecResponse"];
                };
            };
        };
    };
    updateProductSpec: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
                specId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    spec_name?: string;
                    spec_unit?: string | null;
                    spec_value?: string;
                };
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
        };
    };
    deleteProductSpec: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                productId: string;
                specId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
        };
    };
    searchProduct: {
        parameters: {
            query: {
                /** @description pagenumber */
                page?: number;
                /** @description A query phrase */
                q: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1 */
                        current_page?: number;
                        data?: components["schemas"]["ProductResponse"][];
                        /** @example 1 */
                        from?: number;
                        /** @example 1 */
                        last_page?: number;
                        /** @example 1 */
                        per_page?: number;
                        /** @example 1 */
                        to?: number;
                        /** @example 1 */
                        total?: number;
                    };
                };
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    getAverageSalesPerMonth: {
        parameters: {
            query?: {
                /**
                 * @description Specific year
                 * @example 2021
                 */
                year?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: float
                         * @description Average sales amount for the month
                         * @example 9.99
                         */
                        amount?: number;
                        /**
                         * @description Average number of sales for the month
                         * @example 2
                         */
                        average?: number;
                        /**
                         * @description Month number (1 for January, 12 for December)
                         * @example 1
                         */
                        month?: number;
                    }[];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
    getAverageSalesPerWeek: {
        parameters: {
            query?: {
                /**
                 * @description Specific year
                 * @example 2021
                 */
                year?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: number
                         * @description Average sales amount for the week
                         * @example 9.99
                         */
                        amount?: number;
                        /**
                         * @description Average number of sales for the week
                         * @example 2
                         */
                        average?: number;
                        /**
                         * @description Week number of the year (1-52)
                         * @example 1
                         */
                        week?: number;
                    }[];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
    getCustomersByCountry: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Amount of customers
                         * @example 1
                         */
                        amount?: number;
                        /**
                         * @description Country
                         * @example The Netherlands
                         */
                        country?: string;
                    }[];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
    getBestSellingCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Name of the category
                         * @example item
                         */
                        category_name?: string;
                        /**
                         * @description Total earnings from this category
                         * @example 1234
                         */
                        total_earned?: string;
                    }[];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
    getTopPurchasedProducts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Number of times the product was purchased
                         * @example 2
                         */
                        count?: number;
                        /**
                         * @description Name of the product
                         * @example item
                         */
                        name?: string;
                    }[];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
    getTotalSalesOfYears: {
        parameters: {
            query?: {
                /**
                 * @description Number of years
                 * @example 2
                 */
                years?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Total sales for the given year
                         * @example 2
                         */
                        total?: number;
                        /**
                         * @description Year of the sales data
                         * @example 2022
                         */
                        year?: number;
                    }[];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
    getTotalSalesPerCountry: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description The billing country
                         * @example The Netherlands
                         */
                        billing_country?: string;
                        /**
                         * @description Total sales in the country
                         * @example 1234
                         */
                        total_sales?: string;
                    }[];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
    setupTotp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description TOTP setup successful */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description URL for the QR code */
                        qrCodeUrl?: string;
                        /** @description The TOTP secret key */
                        secret?: string;
                    };
                };
            };
            /** @description TOTP already enabled or another error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Error message */
                        error?: string;
                    };
                };
            };
        };
    };
    verifyTotp: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description The user's access token */
                    access_token?: string;
                    /**
                     * @description The 6-digit TOTP code
                     * @example 123456
                     */
                    totp?: string;
                };
            };
        };
        responses: {
            /** @description TOTP verified successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Success message
                         * @example TOTP enabled successfully
                         */
                        message?: string;
                    };
                };
            };
            /** @description Invalid TOTP code or another error */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Error message
                         * @example Invalid TOTP
                         */
                        error?: string;
                    };
                };
            };
        };
    };
    getUsers: {
        parameters: {
            query?: {
                /** @description pagenumber */
                page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example 1 */
                        current_page?: number;
                        data?: components["schemas"]["UserResponse"][];
                        /** @example 1 */
                        from?: number;
                        /** @example 1 */
                        last_page?: number;
                        /** @example 1 */
                        per_page?: number;
                        /** @example 1 */
                        to?: number;
                        /** @example 1 */
                        total?: number;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
        };
    };
    getUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description The userId parameter in path
                 * @example 1
                 */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
        };
    };
    updateUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The userId parameter in path */
                userId: string;
            };
            cookie?: never;
        };
        /** @description User request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    deleteUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The userId parameter in path */
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            404: components["responses"]["ItemNotFoundResponse"];
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["ConflictResponse"];
        };
    };
    patchUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The userId parameter in path */
                userId: string;
            };
            cookie?: never;
        };
        /** @description Partial user request object. Only fields to be updated should be included. */
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserRequest"];
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            405: components["responses"]["MethodNotAllowedResponse"];
            409: components["responses"]["DuplicateConflictResponse"];
            422: components["responses"]["UnprocessableEntityResponse"];
        };
    };
    changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @example welcome01 */
                    current_password?: string;
                    /** @example welcome02 */
                    new_password?: string;
                    /** @example welcome02 */
                    new_password_confirmation?: string;
                };
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            401: components["responses"]["UnauthorizedResponse"];
        };
    };
    forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @example customer@practicesoftwaretesting.com */
                    email?: string;
                };
            };
        };
        responses: {
            200: components["responses"]["UpdateResponse"];
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    "login-customer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @example customer@practicesoftwaretesting.com */
                    email: string;
                    /** @example welcome01 */
                    password: string;
                };
            };
        };
        responses: {
            /** @description A token */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example super-secret-token */
                        access_token?: string;
                        /** @example 120 */
                        expires_in?: number;
                        /** @example Bearer */
                        token_type?: string;
                    };
                };
            };
        };
    };
    logOut: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Result of logout */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Successfully logged out */
                        message?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
        };
    };
    "get-current-customer-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A customer */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
        };
    };
    refreshToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A token */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example super-secret-token */
                        access_token?: string;
                        /** @example 120 */
                        expires_in?: number;
                        /** @example Bearer */
                        token_type?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
        };
    };
    storeUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description User request object */
        requestBody: {
            content: {
                "application/json": components["schemas"]["UserRequest"];
            };
        };
        responses: {
            /** @description Successful operation */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            401: components["responses"]["UnauthorizedResponse"];
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            409: components["responses"]["DuplicateConflictResponse"];
        };
    };
    searchUser: {
        parameters: {
            query: {
                /** @description pagenumber */
                page?: number;
                /** @description A query phrase */
                q: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful operation */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"][];
                };
            };
            401: components["responses"]["UnauthorizedResponse"];
            404: components["responses"]["ItemNotFoundResponse"];
        };
    };
}
