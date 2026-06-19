# Book & Notes Vault

Book & Notes Vault is a vanilla HTML, CSS, and JavaScript app for tracking your reading list, notes, tags, and progress. It 
stores data locally in your browser, so you can manage your collection without a backend.

Demo Video

https://www.loom.com/share/12927f85b987492584ed4427def75c8e

## Features

- Add books with title, author, page count, date added, tags, and notes
- View your collection in both table and card layouts
- Search your books
- Sort the collection by date, title, author, or page count
- See reading stats like total books, total pages, top tag, and recent books
- Track a monthly reading target with a progress bar
- Export your saved books as JSON
- Clear all stored data from the app

## Project Structure

- `index.html` - app layout and sections
- `styles.css` - visual styling and responsive layout
- `app.js` - book storage, rendering, search, stats, and export logic

## How To Run

1. Open `index.html` in a web browser.
2. Use the form to add books to your vault.
3. Refreshing the page will keep your data because it is saved in `localStorage`.

If you prefer, you can also use a local development server such as VS Code Live Server.

## Data Storage

All book records are saved in the browser's `localStorage` under the key `myBooks`. Exported backups are downloaded as a JSON file named `books-backup.json`.

## Notes

- This project does not require any npm dependencies.
- Data stays on the device and browser where it was entered unless you export it.

## Contact

- Email: i.ingabire1@gmail.com
- GitHub: https://github.com/ingabire1-web
  
