# Almora --- E-Commerce Backend

> A Java Spring Boot e-commerce backend focused on backend engineering,
> database optimization, scalable API design, and production-oriented
> architecture.

## Project Overview

Almora is an e-commerce platform being evolved step-by-step to learn and
implement real backend engineering concepts.

The project currently provides:

-   Product CRUD
-   Dynamic product filtering
-   Keyword search
-   Price-range filtering
-   Pagination
-   Dynamic sorting
-   Product reviews and ratings
-   Product images and sizes
-   MySQL persistence
-   MinIO integration direction
-   Performance analysis and optimization roadmap

## Current Architecture

``` text
Client / Frontend
       |
       v
ProductController
       |
       v
ProductService
       |
       v
ProductSpecification
(Dynamic Query Engine)
       |
       v
ProductRepository
       |
       v
Hibernate / JPA
       |
       v
MySQL
```

## Technology Stack

### Backend

-   Java
-   Spring Boot
-   Spring MVC
-   Spring Data JPA
-   Hibernate
-   Jakarta Validation
-   Lombok

### Database

-   MySQL

### Storage

-   MinIO

### Development

-   IntelliJ IDEA
-   Maven
-   Git
-   GitHub

# Completed Features

## Product CRUD

``` text
POST   /api/products
GET    /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
```

Products contain:

-   Name
-   Category
-   Sub-category
-   Brand
-   Sizes
-   Color
-   Price
-   Stock
-   Description
-   Image URLs
-   Active status
-   Average rating
-   Reviews

## Dynamic Product Query Engine

The Product API now supports:

``` text
Category
SubCategory
Brand
Color
Minimum Price
Maximum Price
Keyword
Pagination
Sorting
```

Example:

``` http
GET /api/products?category=MEN&brand=Levis&minPrice=2000&maxPrice=3000&page=0&size=20&sort=price,asc
```

### Query Flow

``` text
HTTP Request
     |
ProductFilterRequest
     |
ProductSpecification
     |
CriteriaBuilder Predicates
     |
ProductRepository
     |
Hibernate
     |
MySQL
```

This allows multiple filters to be combined without creating a separate
repository method for every combination.

## Keyword Search

Keyword search is implemented against the product name.

Conceptually:

``` sql
WHERE LOWER(name) LIKE '%keyword%'
```

Example:

``` http
GET /api/products?keyword=jeans&page=0&size=20
```

## Price Range Filtering

Supports:

``` text
minPrice
maxPrice
```

Example:

``` http
GET /api/products?minPrice=1000&maxPrice=3000
```

## Pagination

Example:

``` http
GET /api/products?page=0&size=20
```

The API returns page metadata such as:

-   Current page
-   Page size
-   Total elements
-   Total pages
-   First/last page information
-   Product content

## Dynamic Sorting

Sorting is handled through Spring Data `Pageable`.

Example:

``` http
GET /api/products?page=0&size=20&sort=price,asc
```

Other examples:

``` text
sort=price,desc
sort=name,asc
sort=stock,desc
```

The Hibernate SQL now generates `ORDER BY` when sorting is requested.

# Development Product Dataset

A development-only `ProductSeeder` was added using:

``` java
@Component
@Profile("dev")
public class ProductSeeder implements CommandLineRunner
```

The seeder checks the current product count and generates products until
the database reaches:

``` text
500 products
```

The generated dataset contains approximately:

``` text
MEN   -> 250
WOMEN -> 250
```

The data varies across:

-   Categories
-   Sub-categories
-   Brands
-   Colors
-   Prices
-   Stock
-   Sizes

The seeder is restricted to the `dev` profile so development test data
is not automatically inserted into production.

# Performance Engineering

After completing the Query Engine, performance testing was started using
the 500-product dataset.

Test request:

``` http
GET /api/products?page=0&size=20
```

The Hibernate logs showed that the main product query itself is not the
primary bottleneck. Additional database queries are being executed for
each returned product.

# N+1 Query Problem Identified

For a page containing 20 products, the current implementation performs
repeated queries for:

``` text
Image URLs
Sizes
Average Rating
Review Count
```

Current baseline:

``` text
20 products

1  Product query
1  Count query
20 Image queries
20 Size queries
20 Average-rating queries
20 Review-count queries

≈ 82 SQL executions
```

The Product service currently calculates rating information per product:

``` java
Double avgRating =
        reviewService.getAverageRating(product.getId());

Long reviewCount =
        reviewService.getReviewCount(product.getId());
```

This causes individual aggregate queries for each product.

## Performance Baseline

``` text
Dataset:
500 products

Request:
GET /api/products?page=0&size=20

Page Size:
20

Approximate SQL Executions:
82
```

The purpose of this baseline is to measure the system before
optimization.

The engineering process is:

``` text
Measure
   |
Identify Bottleneck
   |
Optimize
   |
Measure Again
```

# Current Optimization Target

The first optimization target is the review system.

### Current

``` text
20 products
   |
20 AVG queries
+
20 COUNT queries
```

### Target

Replace per-product review queries with bulk aggregation using:

``` sql
GROUP BY product_id
```

The goal is to retrieve rating information for the whole page with far
fewer database queries.

After that, image and size collection loading will be optimized.

# Scalability Roadmap

## Phase 1 --- Product Query Engine

``` text
DONE  Dynamic Filtering
DONE  Keyword Search
DONE  Price Range
DONE  Pagination
DONE  Sorting
DONE  Combined Queries
```

## Phase 2 --- Database Performance

``` text
IN PROGRESS  N+1 Query Detection
TODO         Bulk Review Aggregation
TODO         Optimize Image Collection Loading
TODO         Optimize Size Collection Loading
TODO         DTO Projections where appropriate
TODO         Database Indexing
TODO         Performance comparison
```

## Phase 3 --- Caching

``` text
TODO Identify cacheable product queries
TODO Redis
TODO Cache-aside pattern
TODO Cache invalidation
TODO Measure cache hit/miss performance
```

## Phase 4 --- Media Storage

``` text
TODO MinIO integration refinement
TODO Object storage architecture
TODO Image upload optimization
TODO Separate application data from media storage
```

## Phase 5 --- Async Processing

Potential areas:

``` text
TODO Background workers
TODO Event-driven operations
TODO RabbitMQ / Kafka where justified
TODO Email processing
TODO Order processing workflows
```

## Phase 6 --- Deployment & Infrastructure

Potential areas:

``` text
TODO Docker
TODO Reverse Proxy
TODO Nginx
TODO Production configuration
TODO Horizontal scaling
TODO Monitoring
TODO Load testing
```

> Technologies will be introduced when there is a clear engineering
> reason to use them, rather than only for demonstration.

# Engineering Philosophy

Almora is a learning-oriented backend engineering project.

The objective is not:

``` text
Add as many technologies as possible.
```

The objective is:

``` text
Problem
   |
Understand
   |
Measure
   |
Design
   |
Implement
   |
Benchmark
   |
Optimize
```

For example:

``` text
N+1 Queries
     |
Measure SQL executions
     |
Bulk aggregation
     |
Compare results
```

This makes architectural decisions explainable during technical
interviews and project evaluations.

# Today's Progress --- 13 August 2026

Today's work moved Almora from feature development into performance
engineering.

## Completed Today

``` text
DONE Completed Dynamic Query Engine
DONE Verified pagination
DONE Verified filtering
DONE Verified keyword search
DONE Verified price range filtering
DONE Verified dynamic sorting
DONE Verified ORDER BY generation
DONE Added development Product Seeder
DONE Generated 500 products
DONE Tested Product API with 20-item pagination
DONE Started SQL performance analysis
DONE Identified N+1-style query behavior
DONE Established initial performance baseline
```

## Current Baseline

``` text
500 products
20 products/page
≈ 82 SQL executions
```

## Next Session

``` text
1. Optimize review aggregation
2. Reduce AVG + COUNT queries
3. Re-run the same API request
4. Compare SQL query count
5. Optimize image and size loading
6. Establish a new performance baseline
```

# Current Project Status

``` text
Product CRUD              ████████████████████ 100%
Dynamic Query Engine      ████████████████████ 100%
Pagination                ████████████████████ 100%
Sorting                   ████████████████████ 100%
Filtering                 ████████████████████ 100%
Keyword Search            ████████████████████ 100%

Performance Engineering   ████░░░░░░░░░░░░░░░░ 20%
N+1 Optimization          ░░░░░░░░░░░░░░░░░░░░ 0%
Database Indexing          ░░░░░░░░░░░░░░░░░░░░ 0%
Redis                      ░░░░░░░░░░░░░░░░░░░░ 0%
Async Processing           ░░░░░░░░░░░░░░░░░░░░ 0%
Docker/Deployment          ░░░░░░░░░░░░░░░░░░░░ 0%
```

# Immediate Next Goal

> Reduce the number of SQL queries generated while returning a paginated
> product listing.

Current:

``` text
20 Products
≈ 82 SQL executions
```

Target:

``` text
20 Products
-> significantly fewer SQL executions
```

The improvement will be measured rather than assumed.

# Project Status

``` text
Project:          Almora
Type:             E-Commerce Platform
Backend:          Java + Spring Boot
Database:         MySQL
Current Dataset:  500 development products
Current Focus:    Backend Performance & Scalability
AI Integration:   Not currently planned for this phase
```

## Development Principle

> Build it. Measure it. Find the bottleneck. Fix it. Measure again.
