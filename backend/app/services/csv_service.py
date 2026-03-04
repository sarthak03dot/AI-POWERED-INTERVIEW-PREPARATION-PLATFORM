import csv
import os
import random
import json
from typing import List, Dict, Any, Optional

class CSVService:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    RAW_DIR = os.path.join(BASE_DIR, 'raw')

    @staticmethod
    def get_random_row(filename: str, filters: Dict[str, str] = None) -> Optional[Dict[str, Any]]:
        file_path = os.path.join(CSVService.RAW_DIR, filename)
        if not os.path.exists(file_path):
            return None

        with open(file_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        if filters:
            rows = [
                row for row in rows
                if all(row.get(k, '').lower() == v.lower() for k, v in filters.items())
            ]

        if not rows:
            return None

        return random.choice(rows)

    @staticmethod
    def append_row(filename: str, data: Dict[str, Any]):
        file_path = os.path.join(CSVService.RAW_DIR, filename)
        file_exists = os.path.exists(file_path)

        # Ensure directory exists
        if not os.path.exists(CSVService.RAW_DIR):
            os.makedirs(CSVService.RAW_DIR)

        fieldnames = data.keys()
        
        with open(file_path, mode='a', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerow(data)

    @staticmethod
    def parse_json_fields(row: Dict[str, Any], fields: List[str]) -> Dict[str, Any]:
        """Helper to parse JSON strings back into Python objects."""
        if not row:
            return row
        
        for field in fields:
            if field in row and isinstance(row[field], str):
                try:
                    row[field] = json.loads(row[field])
                except json.JSONDecodeError:
                    pass
        return row
