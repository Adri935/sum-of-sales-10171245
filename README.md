# Sales Summary Application

This is a single-page application that fetches sales data from a CSV file, calculates the total sales, and displays the result.

## Setup

No setup required. Simply open `index.html` in a browser.

## Usage

The application automatically loads and processes the sales data from the provided CSV attachment. The total sales amount is displayed on the page.

## Code Explanation

- `index.html`: Main HTML structure with Bootstrap 5 integration
- `style.css`: Custom styling for the application
- `script.js`: JavaScript logic for fetching, parsing, and processing CSV data

The application follows these steps:
1. Sets the document title to 'Sales Summary TEST123'
2. Loads Bootstrap 5 from jsDelivr
3. Fetches the CSV data from the provided attachment
4. Parses the CSV content
5. Calculates the sum of the Sales column
6. Displays the total in the #total-sales element
7. Creates a Bootstrap table showing individual product sales

## License
MIT