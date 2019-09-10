#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    ifstream input_file;
    input_file.open("./air quality/january-2017.csv");
    ofstream output_file;
    output_file.open("./air quality/2017-modified.csv");
    string row;
    string headers[400];
    string data[400];
    string sensor[400];
    string data_type[400];
    int row_number = 0;
    int actual_column;
    int columns;
    int line_length;
    bool was_delimiter;
    while (!input_file.eof()) {
        getline(input_file, row);
        line_length = row.length();
        columns = 1;
        for (int i = 0; i < line_length; i++) {
            if (row[i] == ',') {
                columns++;
            }
        }
        actual_column = 0;
        if (row_number == 0) {
            //oszlopnevek inicializálása
            for (int i = 0; i < columns; i++) {
                headers[i] = "";
                sensor[i] = "";
                data_type[i] = "";
            }
            //oszlopnevek szétválasztása
            for (int i = 0; i < line_length; i++) {
                if (row[i] != ',') {
                    headers[actual_column] += row[i];
                }
                else {
                    actual_column++;
                }
            }
            //oszlopnevek felbontása a két komponensre
            for (int i = 1; i < columns; i++) {
                was_delimiter = false;
                for (int j = 0; j < headers[i].length(); j++) {
                    if (headers[i][j] == '_') {
                        was_delimiter = true;
                    }
                    else {
                        if (was_delimiter) {
                            data_type[i] += headers[i][j];
                        }
                        else {
                            sensor[i] += headers[i][j];
                        }
                    }
                }
            }
            //fejlécek kiírása csv-be
            output_file << "UTC time,sensor,data_type,data" << endl;
        }
        else {
            for (int i = 0; i < columns; i++) {
                data[i] = "";
            }
            for (int i = 0; i < line_length; i++) {
                if (row[i] != ',') {
                    data[actual_column] += row[i];
                }
                else {
                    actual_column++;
                }
            }
            for (int i = 1; i < columns; i++) {
                output_file << data[0] << "," << sensor[i] <<
                "," << data_type[i] << "," << data[i] << endl;
            }
        }
        row_number++;
    }
    input_file.close();
    string months[11] = {"february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"};
    for (int s = 0; s < 11; s++) {
        row_number = 0;
        input_file.open("./air quality/" + months[s] + "-2017.csv");
        while (!input_file.eof()) {
            getline(input_file, row);
            line_length = row.length();
            columns = 1;
            for (int i = 0; i < line_length; i++) {
                if (row[i] == ',') {
                    columns++;
                }
            }
            actual_column = 0;
            if (row_number > 0) {
                for (int i = 0; i < columns; i++) {
                    data[i] = "";
                }
                for (int i = 0; i < line_length; i++) {
                    if (row[i] != ',') {
                        data[actual_column] += row[i];
                    }
                    else {
                        actual_column++;
                    }
                }
                for (int i = 1; i < columns; i++) {
                    output_file << data[0] << "," << sensor[i] <<
                    "," << data_type[i] << "," << data[i] << endl;
                }
            }
            row_number++;
        }
        input_file.close();
    }
    return 0;
}
