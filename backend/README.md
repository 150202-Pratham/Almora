# ALMORA --- E-Commerce Platform

> **Current milestone:** Product Query Engine + Performance
> Optimization + Database Index Analysis\
> **Status:** Actively under development\
> **Development dataset:** 500 products

------------------------------------------------------------------------

## 📌 About Almora

**Almora** is a full-stack e-commerce platform being developed with a
production-oriented backend architecture.

The project started with core product and review functionality and is
now evolving toward a scalable e-commerce system. The current
engineering focus is on dynamic product querying, pagination, sorting,
database efficiency, N+1 query elimination, indexing, and measurable
performance.

### Current technology direction

-   Java
-   Spring Boot
-   Spring Data JPA
-   Hibernate
-   MySQL
-   Jakarta Validation
-   Lombok
-   JPA Specification / Criteria API

------------------------------------------------------------------------

# 🏗️ Architecture

``` text
Client / Frontend
       |
       v
Controller
       |
       v
Service Layer
       |
       +--------------------+
       |                    |
       v                    v
Specification          Repository
       |                    |
       +---------+----------+
                 |
                 v
            JPA/Hibernate
                 |
                 v
               MySQL
```

------------------------------------------------------------------------

# 📚 Development Journey

## Phase 1 --- Core Product Management

The project began with a conventional product-management backend.

The `Product` entity currently contains:

-   `id`
-   `name`
-   `category`
-   `subCategory`
-   `brand`
-   `sizes`
-   `color`
-   `price`
-   `stock`
-   `description`
-   `imageUrls`
-   `active`
-   `averageRating`
-   `reviews`

Product category is represented by an enum:

``` java
public enum Category {
    MEN,
    WOMEN
}
```

The product controller provides the foundation for:

-   Create
-   Read
-   Update
-   Delete
-   Product retrieval
-   Product filtering
-   Product search

------------------------------------------------------------------------

# Phase 2 --- DTO-Based API Responses

`ProductDTO` was introduced so API responses are separated from the
persistence entity.

The product response also contains:

-   Average rating
-   Review count

This keeps the API response model independent from the JPA entity
structure.

------------------------------------------------------------------------

# Phase 3 --- Review System

A review system was implemented and associated with products.

Reviews contain:

-   Product
-   User
-   Rating
-   Comment
-   Creation timestamp

Initially, product rating information was calculated using individual
queries:

``` java
getAverageRating(productId)
getReviewCount(productId)
```

This was functionally correct but later became a performance bottleneck
when products were returned in pages.

------------------------------------------------------------------------

# Phase 4 --- Dynamic Product Query Engine

## Why it was introduced

The original repository contained separate methods such as:

``` text
findByCategory(...)
findByCategoryAndSubCategory(...)
findByNameContainingIgnoreCase(...)
```

As filters increased, creating repository methods for every combination
would become difficult to maintain.

The project therefore moved to **Spring Data JPA Specification +
Criteria API**.

## Current filters

`ProductFilterRequest` supports:

``` text
category
subCategory
brand
color
minPrice
maxPrice
keyword
```

The dynamic specification is created through:

``` java
ProductSpecification.filterProducts(request)
```

and executed with:

``` java
repo.findAll(specification, pageable)
```

### Example

A request containing:

``` text
category = MEN
brand = Nike
minPrice = 1000
maxPrice = 3000
```

conceptually produces:

``` sql
WHERE category = 'MEN'
AND brand = 'Nike'
AND price >= 1000
AND price <= 3000
```

Only supplied filters are included.

------------------------------------------------------------------------

# Phase 5 --- Keyword Search

Keyword search was implemented using a case-insensitive `LIKE`
condition.

Conceptually:

``` sql
WHERE LOWER(name) LIKE '%jeans%'
```

This allows values such as:

``` text
Jeans
Blue Jeans
Men's Jeans
Skinny Jeans
```

to match.

The current search is focused on product names.

------------------------------------------------------------------------

# Phase 6 --- Pagination

Pagination was added using Spring Data's `Pageable`.

Example:

``` http
GET /api/products?page=0&size=20
```

The backend returns:

``` java
Page<ProductDTO>
```

and Hibernate generates database pagination using:

``` sql
LIMIT ?, ?
```

### Why pagination matters

Instead of:

``` text
All products
   ↓
Large DB result
   ↓
Large JSON
   ↓
Large network response
```

the application retrieves a manageable page:

``` text
All products
   ↓
20 products
   ↓
API response
```

This provides a foundation for large catalogues.

------------------------------------------------------------------------

# Phase 7 --- Dynamic Sorting

Sorting was integrated through `Pageable`.

Example:

``` http
GET /api/products?page=0&size=20&sort=price,asc
```

Hibernate generates:

``` sql
ORDER BY price
LIMIT ?, ?
```

An earlier implementation manually reconstructed pagination and
accidentally lost sorting information. Passing the original `Pageable`
through the repository fixed this.

The current flow is:

``` text
HTTP sort parameter
       ↓
Pageable
       ↓
Spring Data JPA
       ↓
Hibernate
       ↓
ORDER BY
```

------------------------------------------------------------------------

# Phase 8 --- Development Product Seeder

The original database contained only a few products, which was enough
for functional testing but not meaningful for performance analysis.

A development-only product seeder was introduced to generate:

``` text
500 products
```

The generated products have randomized:

-   Category
-   Subcategory
-   Brand
-   Color
-   Sizes
-   Price
-   Stock
-   Description
-   Image URLs

The seeder uses:

``` java
@Profile("dev")
```

so development data is isolated from production.

It also runs through Spring Boot startup execution using
`CommandLineRunner`.

The seeder checks the existing product count and only creates enough
products to reach 500.

------------------------------------------------------------------------

# Phase 9 --- Performance Baseline

With 500 products available, a page of approximately 20 products was
tested.

The initial SQL behavior was approximately:

``` text
Product query                 1
Pagination count              1
Image collection queries      ~20
Size collection queries       ~20
Average rating queries        ~20
Review count queries          ~20
--------------------------------
Total                        ~82
```

This revealed that the primary problem was not simply the product query.

The DTO conversion was causing repeated database operations.

This became the project's first major performance investigation.

------------------------------------------------------------------------

# Phase 10 --- Review N+1 Query Optimization

## Problem

The original DTO conversion performed:

``` java
Double avgRating =
        reviewService.getAverageRating(product.getId());

Long reviewCount =
        reviewService.getReviewCount(product.getId());
```

for every product.

For 20 products this produced approximately:

``` text
20 average-rating queries
+
20 review-count queries
=
40 review queries
```

This is a classic N+1-style database access problem.

## Solution

A bulk aggregation query was introduced:

``` sql
SELECT
    product_id,
    AVG(rating),
    COUNT(id)
FROM reviews
WHERE product_id IN (...)
GROUP BY product_id;
```

A `ReviewSummaryDTO` was introduced containing:

``` text
productId
averageRating
reviewCount
```

The service now:

1.  Retrieves the product page.
2.  Extracts product IDs.
3.  Executes one review aggregation query.
4.  Builds a `Map<Long, ReviewSummaryDTO>`.
5.  Converts products using the already-loaded review summary.

Conceptually:

``` text
Products
   |
   v
[product IDs]
   |
   v
ONE bulk review query
   |
   v
ReviewSummary map
   |
   v
DTO conversion
```

This reduced approximately 40 review queries to one bulk query.

------------------------------------------------------------------------

# Phase 11 --- Hibernate Batch Fetching

After review optimization, repeated collection loading remained.

The product entity contains:

``` java
@ElementCollection
private List<String> sizes;
```

and:

``` java
@ElementCollection(fetch = FetchType.EAGER)
private List<String> imageUrls;
```

Initially Hibernate repeatedly executed collection queries using:

``` sql
WHERE product_id = ?
```

for individual products.

Hibernate batch fetching was introduced using:

``` java
@BatchSize(size = 20)
```

for the collections.

Hibernate then generated queries using:

``` sql
WHERE product_id IN (?, ?, ?, ...)
```

instead of one collection query per product.

This was applied to:

``` text
imageUrls
sizes
```

### Important concept

`@BatchSize` does not guarantee exactly one query.

It tells Hibernate that multiple pending collection/entity loads can be
fetched in batches, reducing database round trips.

------------------------------------------------------------------------

# Phase 12 --- Performance Result

The same 20-product request evolved approximately as follows:

``` text
Initial implementation
        ↓
~82 SQL executions
        |
        | Bulk review aggregation
        v
~43 SQL executions
        |
        | Hibernate batch fetching
        v
~5 main SQL operations
```

The final structure was approximately:

``` text
Product query                 1
Image batch query              1
Pagination count               1
Review aggregation             1
Size batch query               1
--------------------------------
Total                          ~5
```

The exact number can vary depending on the request and Hibernate
behavior.

The important result is that per-product database operations were
removed from the product listing path.

------------------------------------------------------------------------

# Phase 13 --- Database `EXPLAIN` Analysis

After reducing unnecessary database round trips, the next phase moved to
database-level query efficiency.

MySQL `EXPLAIN` was used to understand how queries were executed.

Initially:

``` sql
EXPLAIN
SELECT *
FROM products
WHERE category = 'MEN'
AND brand = 'Nike';
```

returned:

``` text
type = ALL
possible_keys = NULL
key = NULL
rows = 500
```

This indicated a full table scan.

The objective became:

``` text
Application query
      ↓
Generated SQL
      ↓
EXPLAIN
      ↓
Execution plan
      ↓
Index decision
```

------------------------------------------------------------------------

# Phase 14 --- Database Indexes

Indexes were added for important product filters:

``` sql
CREATE INDEX idx_products_category
ON products(category);
```

``` sql
CREATE INDEX idx_products_brand
ON products(brand);
```

``` sql
CREATE INDEX idx_products_price
ON products(price);
```

and a composite index:

``` sql
CREATE INDEX idx_products_category_brand
ON products(category, brand);
```

------------------------------------------------------------------------

# Phase 15 --- Measuring Index Effectiveness

After adding indexes, `EXPLAIN` showed actual index usage.

## Category

Before:

``` text
type = ALL
rows = 500
```

After:

``` text
type = ref
key = idx_products_category
rows = 249
```

## Brand

Before:

``` text
type = ALL
rows = 500
```

After:

``` text
type = ref
key = idx_products_brand
rows = 80
```

## Category + Brand

The composite index was selected:

``` text
type = ref
key = idx_products_category_brand
rows = 40
```

This demonstrated that the composite index was aligned with the tested
multi-column filter.

------------------------------------------------------------------------

# Important Indexing Lesson

An index being present does **not** mean MySQL must use it.

For:

``` sql
WHERE price BETWEEN 1000 AND 3000
```

MySQL still selected a table scan in the current 500-row dataset.

The reason is that a relatively large percentage of the table matched
the condition, so scanning the small table could be cheaper than using
the index.

This is why the project uses:

``` text
EXPLAIN
```

instead of blindly adding indexes.

------------------------------------------------------------------------

# Phase 16 --- Real Almora Query Engine Verification

The actual API was tested using:

``` http
GET /api/products?category=MEN&brand=Nike&page=0&size=20&sort=price,asc
```

Hibernate generated:

``` sql
SELECT ...
FROM products
WHERE category = ?
AND brand = ?
ORDER BY price
LIMIT ?, ?
```

This verified the complete chain:

``` text
HTTP Request
      ↓
ProductFilterRequest
      ↓
ProductSpecification
      ↓
Pageable
      ↓
ProductRepository
      ↓
Hibernate
      ↓
MySQL
```

The request correctly produced:

### Filtering

``` sql
WHERE category = ?
AND brand = ?
```

### Sorting

``` sql
ORDER BY price
```

### Pagination

``` sql
LIMIT ?, ?
```

The optimized review aggregation and batch collection loading were also
preserved.

------------------------------------------------------------------------

# 📊 Current System

The current product-listing path is approximately:

``` text
                    CLIENT
                      |
                      v
              ProductController
                      |
                      v
               ProductService
                      |
          +-----------+-----------+
          |                       |
          v                       v
 ProductSpecification          Pageable
          |                       |
          +-----------+-----------+
                      |
                      v
              ProductRepository
                      |
                      v
                  Hibernate
                      |
                      v
                    MySQL
                      |
       +--------------+--------------+
       |              |              |
       v              v              v
   Filtering       Sorting       Pagination
       |
       v
   Product Page
       |
       +-----------+-----------+
       |           |           |
       v           v           v
    Reviews      Images      Sizes
     Bulk        Batch       Batch
```

------------------------------------------------------------------------

# 📈 Performance Journey

``` text
~82 SQL executions
        |
        | Review N+1 optimization
        v
~43 SQL executions
        |
        | @BatchSize
        v
~5 main SQL operations
        |
        | EXPLAIN
        v
Index analysis
        |
        v
Real API verification
```

------------------------------------------------------------------------

# ✅ Completed So Far

-   [x] Product entity
-   [x] Product CRUD
-   [x] Product DTO
-   [x] Review system
-   [x] Average rating
-   [x] Review count
-   [x] Dynamic product filtering
-   [x] Category filtering
-   [x] Subcategory filtering
-   [x] Brand filtering
-   [x] Color filtering
-   [x] Price-range filtering
-   [x] Keyword search
-   [x] Pagination
-   [x] Dynamic sorting
-   [x] Development profile
-   [x] 500 development products
-   [x] Performance baseline
-   [x] Review N+1 detection
-   [x] Bulk review aggregation
-   [x] Image batch fetching
-   [x] Size batch fetching
-   [x] Hibernate `@BatchSize`
-   [x] MySQL `EXPLAIN` analysis
-   [x] Category index
-   [x] Brand index
-   [x] Price index
-   [x] Category + Brand composite index
-   [x] Real API filtering + sorting + pagination verification

------------------------------------------------------------------------

# 🔜 Next Planned Work

## 1. Filter + Sort Composite Index Analysis

The real API currently generates:

``` sql
WHERE category = ?
AND brand = ?
ORDER BY price
LIMIT ?, ?
```

The next database experiment is to evaluate whether a composite index
such as:

``` sql
(category, brand, price)
```

provides a meaningful advantage for the real filtering + sorting
pattern.

This will be tested with `EXPLAIN` before being adopted.

------------------------------------------------------------------------

## 2. API Performance Benchmarking

The next stage is to measure actual response performance rather than
only SQL count.

Planned measurements:

-   Response time
-   Database execution behavior
-   Different filter combinations
-   Different page sizes
-   Sorting performance
-   Increasing dataset sizes

------------------------------------------------------------------------

## 3. Larger Dataset Testing

The current development dataset is:

``` text
500 products
```

Future testing will increase the dataset to evaluate behavior at larger
scales, potentially:

``` text
5,000
50,000
100,000+
```

The purpose is to identify where query plans and response times begin to
degrade.

------------------------------------------------------------------------

## 4. Stable Pagination Response DTO

Spring currently warns when `PageImpl` is serialized directly.

A future improvement will introduce a dedicated pagination response DTO
rather than exposing Spring's internal `PageImpl` representation
directly.

Potential structure:

``` json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 500,
  "totalPages": 25,
  "first": true,
  "last": false
}
```

------------------------------------------------------------------------

## 5. Search Optimization

The current keyword search uses:

``` sql
LOWER(name) LIKE '%keyword%'
```

This is appropriate for the current stage but may not scale well to very
large catalogues.

Future possibilities include:

-   MySQL FULLTEXT
-   Dedicated search infrastructure
-   Elasticsearch/OpenSearch if justified by scale

No dedicated search engine has been introduced yet.

------------------------------------------------------------------------

## 6. Caching

Redis may be introduced later for data that is frequently requested and
expensive to compute.

The project intentionally follows:

``` text
Fix inefficient queries
        ↓
Optimize database access
        ↓
Measure
        ↓
Cache when justified
```

Redis is therefore a future optimization, not the first response to
every performance problem.

------------------------------------------------------------------------

## 7. Future E-Commerce Modules

After the product/query foundation is mature, the broader platform
roadmap includes:

-   Cart
-   Orders
-   Checkout
-   Payments
-   Authentication/authorization
-   Inventory management
-   Frontend product experience
-   Search
-   Additional performance optimization

------------------------------------------------------------------------

# 🧠 Engineering Approach

Almora is being developed using an evidence-based optimization cycle:

``` text
1. Build the feature
       ↓
2. Observe generated SQL
       ↓
3. Measure
       ↓
4. Identify bottleneck
       ↓
5. Optimize
       ↓
6. Measure again
       ↓
7. Repeat
```

Examples already completed:

``` text
N+1 review queries
       ↓
Bulk aggregation

Per-product collection loading
       ↓
Hibernate batch fetching

Full table scans
       ↓
EXPLAIN + indexes
```

The goal is not simply to make the application work.

The goal is to understand the complete path:

``` text
Spring Boot
    ↓
Spring Data JPA
    ↓
Hibernate
    ↓
SQL
    ↓
MySQL execution plan
    ↓
Performance
```

------------------------------------------------------------------------

# 🎯 Current Milestone

## Product Query & Performance Engine

The current Almora backend has moved beyond basic CRUD and now contains:

``` text
Dynamic filtering
        +
Keyword search
        +
Price ranges
        +
Pagination
        +
Sorting
        +
Bulk review aggregation
        +
Hibernate batch fetching
        +
Database indexes
        +
EXPLAIN analysis
        +
Real API verification
```

### Current focus

> **Benchmark the real API and optimize the filter + sort database
> execution plan.**

------------------------------------------------------------------------

# 👨‍💻 Development Status

``` text
[COMPLETED]
Core Product CRUD
        ↓
[COMPLETED]
Product DTOs + Reviews
        ↓
[COMPLETED]
Dynamic Query Engine
        ↓
[COMPLETED]
Pagination + Sorting
        ↓
[COMPLETED]
500 Product Dataset
        ↓
[COMPLETED]
Performance Baseline
        ↓
[COMPLETED]
Review N+1 Optimization
        ↓
[COMPLETED]
Collection Batch Fetching
        ↓
[COMPLETED]
Database EXPLAIN Analysis
        ↓
[COMPLETED]
Initial Indexing
        ↓
[COMPLETED]
Real API Query Verification
        ↓
[NEXT]
Filter + Sort Index Analysis
        ↓
[NEXT]
API Benchmarking
        ↓
[NEXT]
Larger Dataset Testing
        ↓
[FUTURE]
Caching / Redis
        ↓
[FUTURE]
Search Optimization
        ↓
[FUTURE]
Cart / Orders / Checkout / Payments
```

------------------------------------------------------------------------

# ⭐ Project Status

**ALMORA is actively under development.**

The current milestone establishes a scalable foundation for the product
catalogue by combining:

> **Dynamic querying + pagination + sorting + efficient database
> access + measurable performance + database execution-plan analysis.**

The next development phase will focus on benchmarking and validating
performance as the dataset grows.
