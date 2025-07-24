import React, { useState, useRef, useEffect } from 'react';
import { Table, ChevronDown, Plus, Minus } from 'lucide-react';

export const TableCreator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const createTable = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-container';
    tableContainer.setAttribute('data-table-id', Date.now().toString());
    tableContainer.style.cssText = `
      margin: 20px 0;
      overflow-x: auto;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
    `;

    // Create table
    const table = document.createElement('table');
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      font-family: Arial, sans-serif;
      table-layout: fixed;
    `;

    // Create header row with blank headers
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    for (let j = 0; j < columns; j++) {
      const th = document.createElement('th');
      th.style.cssText = `
        border: 1px solid #e5e7eb;
        padding: 12px 8px;
        text-align: left;
        font-weight: bold;
        color: #374151;
        background-color: #f8f9fa;
        min-width: 100px;
        word-wrap: break-word;
      `;
      th.contentEditable = 'true';
      th.setAttribute('data-cell-type', 'header');
      th.setAttribute('data-row', '0');
      th.setAttribute('data-col', j.toString());
      th.innerHTML = '&nbsp;'; // Start with blank header
      
      // Add focus and blur handlers for better UX
      th.addEventListener('focus', () => {
        if (th.textContent === '\u00A0' || th.textContent === '') {
          th.innerHTML = '';
        }
      });
      
      th.addEventListener('blur', () => {
        if (th.textContent?.trim() === '') {
          th.innerHTML = '&nbsp;';
        }
      });
      
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body rows
    const tbody = document.createElement('tbody');
    for (let i = 0; i < rows - 1; i++) { // -1 because header counts as first row
      const row = document.createElement('tr');

      for (let j = 0; j < columns; j++) {
        const td = document.createElement('td');
        td.style.cssText = `
          border: 1px solid #e5e7eb;
          padding: 12px 8px;
          color: #374151;
          min-height: 20px;
          min-width: 100px;
          word-wrap: break-word;
          background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};
        `;
        td.contentEditable = 'true';
        td.setAttribute('data-cell-type', 'data');
        td.setAttribute('data-row', (i + 1).toString());
        td.setAttribute('data-col', j.toString());
        td.innerHTML = '&nbsp;';
        
        // Add focus and blur handlers
        td.addEventListener('focus', () => {
          if (td.textContent === '\u00A0' || td.textContent === '') {
            td.innerHTML = '';
          }
        });
        
        td.addEventListener('blur', () => {
          if (td.textContent?.trim() === '') {
            td.innerHTML = '&nbsp;';
          }
        });
        
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);

    // Add keyboard navigation
    const addKeyboardNavigation = () => {
      const cells = table.querySelectorAll('th, td');
      
      cells.forEach((cell) => {
        cell.addEventListener('keydown', (e) => {
          const event = e;
          const currentCell = event.target;
          const currentRow = parseInt(currentCell.getAttribute('data-row') || '0');
          const currentCol = parseInt(currentCell.getAttribute('data-col') || '0');
          
          if (event.key === 'Tab') {
            event.preventDefault();
            
            let nextRow = currentRow;
            let nextCol = currentCol;
            
            if (event.shiftKey) {
              // Shift+Tab: Move to previous cell
              if (currentCol > 0) {
                nextCol = currentCol - 1;
              } else if (currentRow > 0) {
                nextRow = currentRow - 1;
                nextCol = columns - 1;
              }
            } else {
              // Tab: Move to next cell
              if (currentCol < columns - 1) {
                nextCol = currentCol + 1;
              } else {
                // End of row - move to next row or create new row
                if (currentRow < rows - 1) {
                  nextRow = currentRow + 1;
                  nextCol = 0;
                } else {
                  // Create new row at the end
                  addNewRow();
                  nextRow = currentRow + 1;
                  nextCol = 0;
                }
              }
            }
            
            // Find and focus the target cell
            const targetCell = table.querySelector(`[data-row="${nextRow}"][data-col="${nextCol}"]`);
            if (targetCell) {
              targetCell.focus();
              
              // Select all content in the cell for easy editing
              const range = document.createRange();
              const selection = window.getSelection();
              range.selectNodeContents(targetCell);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
          }
        });
      });
    };

    // Function to add a new row
    const addNewRow = () => {
      const newRow = document.createElement('tr');
      const currentRows = tbody.children.length + 1; // +1 for header
      
      for (let j = 0; j < columns; j++) {
        const td = document.createElement('td');
        td.style.cssText = `
          border: 1px solid #e5e7eb;
          padding: 12px 8px;
          color: #374151;
          min-height: 20px;
          min-width: 100px;
          word-wrap: break-word;
          background-color: ${currentRows % 2 === 0 ? '#ffffff' : '#f9fafb'};
        `;
        td.contentEditable = 'true';
        td.setAttribute('data-cell-type', 'data');
        td.setAttribute('data-row', currentRows.toString());
        td.setAttribute('data-col', j.toString());
        td.innerHTML = '&nbsp;';
        
        // Add focus and blur handlers
        td.addEventListener('focus', () => {
          if (td.textContent === '\u00A0' || td.textContent === '') {
            td.innerHTML = '';
          }
        });
        
        td.addEventListener('blur', () => {
          if (td.textContent?.trim() === '') {
            td.innerHTML = '&nbsp;';
          }
        });
        
        newRow.appendChild(td);
      }
      
      tbody.appendChild(newRow);
      setRows(prevRows => prevRows + 1); // Update row count
      
      // Re-add keyboard navigation to new cells
      addKeyboardNavigation();
    };

    tableContainer.appendChild(table);

    // Add keyboard navigation
    addKeyboardNavigation();

    // Insert table at cursor position
    range.deleteContents();
    range.insertNode(tableContainer);
    
    // Move cursor to first header cell
    const firstCell = table.querySelector('th');
    if (firstCell) {
      setTimeout(() => {
        firstCell.focus();
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(firstCell);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }, 10);
    }
    
    setIsOpen(false);
  };

  const adjustValue = (type, delta) => {
    if (type === 'rows') {
      setRows(Math.max(1, Math.min(50, rows + delta)));
    } else {
      setColumns(Math.max(1, Math.min(20, columns + delta)));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Insert Table"
      >
        <Table size={16} />
        <span>Table</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[320px]">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Create Custom Table</h3>
            
            <div className="space-y-4">
              {/* Rows */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Number of rows:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustValue('rows', -1)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={rows <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={rows}
                    onChange={(e) => setRows(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => adjustValue('rows', 1)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={rows >= 50}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Columns */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Number of columns:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustValue('columns', -1)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={columns <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={columns}
                    onChange={(e) => setColumns(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => adjustValue('columns', 1)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={columns >= 20}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-2">Table Preview:</div>
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${Math.min(columns, 6)}, 1fr)` }}>
                  {/* Header row */}
                  {Array.from({ length: Math.min(columns, 6) }).map((_, index) => (
                    <div
                      key={`header-${index}`}
                      className="h-8 border-r border-b border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium last:border-r-0"
                    >
                      Header
                    </div>
                  ))}
                  {/* Data rows */}
                  {Array.from({ length: Math.min((rows - 1) * columns, 30) }).map((_, index) => {
                    const rowIndex = Math.floor(index / Math.min(columns, 6));
                    const isLastCol = (index % Math.min(columns, 6)) === Math.min(columns, 6) - 1;
                    return (
                      <div
                        key={`cell-${index}`}
                        className={`h-6 border-r border-b border-gray-300 flex items-center justify-center text-xs text-gray-500 ${
                          rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } ${isLastCol ? 'border-r-0' : ''}`}
                      >
                        Cell
                      </div>
                    );
                  })}
                </div>
                {columns > 6 && (
                  <div className="text-xs text-gray-500 text-center py-2 bg-gray-50">
                    ...and {columns - 6} more columns
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            <button
              onClick={createTable}
              className="w-full px-4 py-2 bg-[#1a1a8c] text-white rounded hover:bg-[#141466] transition-colors font-medium"
            >
              Create Table ({rows} × {columns})
            </button>
          </div>

          <div className="p-3 border-t border-gray-200 bg-blue-50">
            <p className="text-xs text-blue-800 font-medium mb-2">Table Features:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Tab Navigation:</strong> Use Tab/Shift+Tab to move between cells</li>
              <li>• <strong>Auto-expand:</strong> Tab from last cell creates a new row</li>
              <li>• <strong>Blank Headers:</strong> Headers start empty for custom labeling</li>
              <li>• <strong>Export Ready:</strong> Properly formatted for PDF and Word export</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};