package sensordatasplitter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.io.FileWriter;
import java.io.BufferedReader;

/**
 *
 * @author hstgu5
 */
 class Data
{
String Data;
    String time;
    String temperature;
    int id;
    String humidity;
    String pressure;
    String pm1;
    String pm10;
    String pm25;

}
public class SensorDataSplitter {
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws FileNotFoundException, IOException { 
    // List<Data> records = new ArrayList<>();
    BufferedReader br = new BufferedReader(new FileReader("april-2017.csv"));
    FileWriter writer = new FileWriter("splitted.csv");
    String line= br.readLine();
    writer.write("time,id,temperature,humidity,pressure,pm1,pm25,pm10");
    String[] idvalues = line.split(",");
    List<Integer> id = new ArrayList<>();
        for (int i = 1; i < idvalues.length; i++) 
        {
            
            if (idvalues[i].split("_")[0]!=idvalues[i-1].split("_")[0]) 
            {
               String substring = idvalues[i].split("_")[0];
               id.add(Integer.parseInt(substring));
               System.out.println(substring);
            }
        }
       
    while ((line = br.readLine()) != null) {
        
        String[] values = line.split(",");
        
        for (int i = 1; i < values.length;++i) 
        {
           // writer.write(String.valueOf(i)+" ");
            
            if ((i-1)%6==0) 
            {
             //writer.write(values[0]+',');
             //writer.write((id.get(i/6)).toString());
            }
            writer.write(values[i]);
            if((i)%6==0)
            {   
            writer.write('\n');
            writer.write(values[0]+',');
            writer.write((id.get(i-1)).toString()+',');
            }
            else
             writer.write(',');
            /*
            Data data = new Data();
            data.time=values[0];
            
            
            
            //data.id= id.get(i/6);
            data.temperature = values[1];
            data.humidity = values[i+1];
            data.pressure = values[i+2];
            data.pm1 = values[i+3];
            data.pm25 = values[i+4];
            data.pm10 = values[i+5];
            writer.write(data.time+","+1+","+data.temperature+","+data.humidity+","+data.pressure+","+data.pm1+","+data.pm25+","+data.pm10+'\n');
            
            records.add(data);
            */
           //writer.write(values[0]+","+id.get(i)+","+values[i]+","+values[i+1]+","+values[i+2]+","+values[i+3]+","+values[i+4]+","+values[i+5]+","+'\n');
        }
        
        //records.add(Arrays.asList(values));
    }
    writer.flush();
    writer.close();

        }
        
        
    
}
    
    

