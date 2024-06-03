from pymongo.collection import Collection


class ApplicationSchemaCrud:
    def __init__(self, collection: Collection):
        self.__collection = collection

    def add_application_schema(self, application_id: int, requirement_list: list[dict], cell_list: list[dict],
                               row_count: int, column_count: int):
        self.__collection.insert_one({"application_id": application_id, "requirements": requirement_list,
                                      "table_cells": cell_list, "row_count": row_count, "column_count": column_count})

    def add_or_update_schema(self, application_id: int, requirement_list: list[dict], cell_list: list[dict],
                             row_count: int, column_count: int):
        found = self.__collection.find_one({"application_id": application_id})

        if found is None:
            self.add_application_schema(application_id, requirement_list, cell_list, row_count, column_count)
        else:
            self.update_schema(application_id, requirement_list, cell_list, row_count, column_count)

    def delete_schema_by_application_id(self, application_id: int):
        self.__collection.delete_one({"application_id": application_id})

    def update_schema(self, application_id: int, new_requirement_list: list[dict], new_cell_list: list[dict],
                      new_row_count: int, new_column_count: int):
        self.__collection.update_one({"application_id": application_id},
                                     {"$set": {"requirements": new_requirement_list, "table_cells": new_cell_list,
                                               "row_count": new_row_count, "column_count": new_column_count}})

    def get_schema_by_application_id(self, application_id: int) -> (list[dict], list[dict], int, int):
        found = self.__collection.find_one({"application_id": application_id})

        if found is None:
            return None

        return found.get("requirements"), found.get("table_cells"), found.get("row_count"), found.get("column_count")
