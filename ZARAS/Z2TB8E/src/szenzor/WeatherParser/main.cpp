#include <iostream>
#include <fstream>
#include <string>
#include <queue>
#include <algorithm>
#include <vector>

int main()
{
    std::vector<std::ifstream> data;
    data.push_back(std::ifstream("tables/january-2017.csv"));
    data.push_back(std::ifstream("tables/february-2017.csv"));
    data.push_back(std::ifstream("tables/march-2017.csv"));
    data.push_back(std::ifstream("tables/april-2017.csv"));
    data.push_back(std::ifstream("tables/may-2017.csv"));
    data.push_back(std::ifstream("tables/june-2017.csv"));
    data.push_back(std::ifstream("tables/july-2017.csv"));
    data.push_back(std::ifstream("tables/august-2017.csv"));
    data.push_back(std::ifstream("tables/september-2017.csv"));
    data.push_back(std::ifstream("tables/october-2017.csv"));
    data.push_back(std::ifstream("tables/november-2017.csv"));
    data.push_back(std::ifstream("tables/december-2017.csv"));

    std::string line;

    getline(data[0],line);
    unsigned int pos = line.find(',');
    std::string subs = line.substr(0,pos);
    line = line.substr(pos+1, line.length());
    std::string prevId = "";
    std::queue<std::string> Ids;
    while(std::string::npos != (pos = line.find(','))){
        subs = line.substr(0,pos);
        subs = subs.substr(0,subs.find('_'));
        if(prevId != subs){
            Ids.push(subs);
            prevId = subs;
        }
        line = line.substr(pos + 1, line.length());
    }

    bool first = true;
    std::ofstream outFile("output.csv");
    outFile << "time,sensor.id,temperature,humidity,pressure,pm1,pm25,pm10" << std::endl;
    for(int i = 0; i < data.size(); ++i){
        if(first) first = false;
        else getline(data[i], line);
        while(getline(data[i],line)){
            pos = line.find(',');
            std::string ts(line.substr(0,pos));
            line = line.substr(pos + 1, line.length()) + ',';
            int c = 0;
            while((pos = line.find(',')) != std::string::npos){
                if(!c++){
                    std::replace(ts.begin(),ts.end(),'T',' ');
                    outFile << ts << ',' << Ids.front();
                    Ids.push(Ids.front());
                    Ids.pop();
                }
                subs = line.substr(0,pos);
                line = line.substr(pos + 1, line.length());
                outFile << ',' << subs;
                if(!(c = c%6)){
                    outFile << std::endl;
                }
            }
        }
    }

    return 0;
}
