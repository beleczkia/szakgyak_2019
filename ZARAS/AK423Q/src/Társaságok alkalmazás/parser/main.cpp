#include <iostream>
#include <fstream>
#include <set>
#include <iosfwd>
#include <sstream>
using namespace std;

string my_replace(string original){
    bool was_space=true;
    string x = "";
    for (unsigned int i=0; i<original.size(); i++){
        if (original[i]==' '){
            if (!was_space){
                if (original[i]!=',') x += original[i];
                was_space=true;
            }
        }
        else {
            if (original[i]!=',') x += original[i];
            was_space=false;
        }
    }
    return x;
}

int main()
{
    setlocale(LC_ALL, "Hun");
    ifstream x;
    ofstream y;
    x.open("tarsasagok_mod_endless_4.txt");
    y.open("tarsasagok_mod_out.txt");
    string s1, s2;
    int p, q, r, t, u, v;
    t=u=0;
    p=-1;
    string data[50];
    string oszlopok[50];
    string address_out;
    bool ready, halfway;
    int index;
    bool fs, ss, fp;
    while (!x.eof()){
        getline(x, s1);
        r=q=v=0;
        for (int i=0; i<=25; i++){
            data[i]="";
        }
        while (r<s1.length()){
            if (s1[r]!='"') data[q]+=s1[r];
            r++;
            if (s1[r]=='\t'){
                q++;
                r++;
            }
        }
        //if (p!=0) cout << data[2] << endl;
        index=0;
        ready=halfway=false;
        address_out="";
        data[2]=my_replace(data[2]);
        fs=ss=fp=false;
        while (p!=0 && data[18]=="HU" && !ready && index<data[2].size()){
            //cout << "utcák" << endl << data[2].substr(index, 2) << endl << data[2].substr(index, 5) << endl << endl; cin.get();
            if (data[2][index]==' '){
                v++;
            }
            if (!halfway){
                if (data[2].substr(index, 5)==" utca"){
                    address_out+=" utca ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=5;
                }
                else if (data[2].substr(index, 4)==" krt"){
                    address_out+=" körút ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=4;
                }
                else if (data[2].substr(index, 6)==" körút"){
                    address_out+=" körút ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=6;
                }
                else if (data[2].substr(index, 2)==" u"){
                    address_out+=" utca ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=2;
                }
                else if (data[2].substr(index, 4)==" tér"){
                    address_out+=" tér ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=4;
                }
                else if (data[2].substr(index, 7)==" körtér"){
                    address_out+=" tér ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=7;
                }
                else if (data[2].substr(index, 3)==" út"){
                    address_out+=" út ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=3;
                }
                else if (data[2].substr(index, 5)==" hegy"){
                    address_out+=" hegy ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=5;
                }
                else if (data[2].substr(index, 4)==" sor"){
                    address_out+=" sor ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=4;
                }
                else if (data[2].substr(index, 6)==" fasor"){
                    address_out+=" fasor ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=6;
                }
                else if (data[2].substr(index, 5)==" tere"){
                    address_out+=" tere ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=5;
                }
                else if (data[2].substr(index, 4)==" köz"){
                    address_out+=" köz ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=4;
                }
                else if (data[2].substr(index, 8)==" sugárút"){
                    address_out+=" sugárút ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=8;
                }
                else if (data[2].substr(index, 5)==" park"){
                    address_out+=" park ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=5;
                }
                else if (data[2].substr(index, 5)==" kapu"){
                    address_out+=" kapu ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=5;
                }
                else if (data[2].substr(index, 6)==" telep"){
                    address_out+=" telep ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=6;
                }
                else if (data[2].substr(index, 7)==" sétány"){
                    address_out+=" sétány ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=7;
                }
                else if (data[2].substr(index, 10)==" lakótelep"){
                    address_out+=" lakótelep ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=10;
                }
                else if (data[2].substr(index, 8)==" rakpart"){
                    address_out+=" rakpart ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=8;
                }
                else if (data[2].substr(index, 5)==" dûlõ"){
                    address_out+=" dûlõ ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=5;
                }
                else if (data[2].substr(index, 3)==" d."){
                    address_out+=" dûlõ ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=3;
                }
                else if (data[2].substr(index, 4)==" rét"){
                    address_out+=" rét ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=4;
                }
                else if (data[2].substr(index, 4)==" ltp"){
                    address_out+=" lakótelep ";
                    //cout << "---  " << index << endl;
                    halfway=true;
                    index+=4;
                }
                else {
                    if (!(index==4 && data[2][4]==',')) address_out+=data[2][index];
                    //address_out+=data[2][index];
                }
                if (v==2 && data[2][0]=='1'){
                    if (data[2].substr(index+1, 2)=="I ") index+=1;
                    if (data[2].substr(index+1, 3)=="II ") index+=2;
                    if (data[2].substr(index+1, 4)=="III ") index+=3;
                    if (data[2].substr(index+1, 3)=="IV ") index+=2;
                    if (data[2].substr(index+1, 2)=="V ") index+=1;
                    if (data[2].substr(index+1, 3)=="VI ") index+=2;
                    if (data[2].substr(index+1, 4)=="VII ") index+=3;
                    if (data[2].substr(index+1, 5)=="VIII ") index+=4;
                    if (data[2].substr(index+1, 3)=="IX ") index+=2;
                    if (data[2].substr(index+1, 2)=="X ") index+=1;
                    if (data[2].substr(index+1, 3)=="XI ") index+=2;
                    if (data[2].substr(index+1, 4)=="XII ") index+=3;
                    if (data[2].substr(index+1, 5)=="XIII ") index+=4;
                    if (data[2].substr(index+1, 4)=="XIV ") index+=3;
                    if (data[2].substr(index+1, 3)=="XV ") index+=2;
                    if (data[2].substr(index+1, 4)=="XVI ") index+=3;
                    if (data[2].substr(index+1, 5)=="XVII ") index+=4;
                    if (data[2].substr(index+1, 6)=="XVIII ") index+=5;
                    if (data[2].substr(index+1, 4)=="XIX ") index+=3;
                    if (data[2].substr(index+1, 3)=="XX ") index+=2;
                    if (data[2].substr(index+1, 4)=="XXI ") index+=3;
                    if (data[2].substr(index+1, 5)=="XXII ") index+=4;
                    if (data[2].substr(index+1, 6)=="XXIII ") index+=5;
                }
            }
            else {
                address_out+=data[2][index];
                ss=fs && data[2][index]==' ';
                fs=fs || data[2][index]==' ';
                fp=fp || data[2][index]=='.';
                ready=fp || ss;
            }
            //if (p%20==0) cout << index << "   " << address_out << endl;
            //if (p%20==0) cout << fs << " " << ss << " " << fp << endl;
            index++;
        }
        address_out=my_replace(address_out);
        if (data[18]=="HU" && !ready){
            //cout << p << endl << data[2] << endl;
            //cin.get();
            u++;
            //ezek a speciálisan kezelt címek, ezt konzolból kézzel csináljuk meg
            if (halfway){
                cout << data[2] << endl << address_out << endl;
                cin.get();
            }
        }
        else if (data[18]=="HU" && halfway){
            //if (p%10==0){
                /*if (data[2]!=address_out){
                    cout << data[2] << endl << address_out << endl;
                    cin.get();
                }
                else {

                }*/
            //}
        }
        p++;

        if (q==25){
            t++;
        }
        //if (p%20==0) cin.get();
        if (p==0){
            for (int i=0; i<=25; i++){
                oszlopok[i]=data[i];
            }
        }
    }
    //cout << data[1][5] << " " << data[100][20] << endl;
    cout << u << endl;
    return 0;
}


/*
#include <iostream>
#include <fstream>
#include <set>
#include <iosfwd>
#include <sstream>
using namespace std;

int main()
{
    setlocale(LC_ALL, "Hun");
    ifstream x;
    ofstream y;
    x.open("tarsasagok_mod_endless_4.txt");
    y.open("tarsasagok_mod_4.json");
    string s1, s2;
    int p, q, r, t;
    t=0;
    p=-1;
    string data[50];
    string oszlopok[50];
    bool tipusok[26];
    for (int i=0; i<=25; i++){
        tipusok[i]=false;
    }
    tipusok[4]=true;
    tipusok[7]=true;
    tipusok[9]=true;
    //tipusok[13]=true;
    tipusok[15]=true;
    //tipusok[16]=true;
    tipusok[20]=true;
    tipusok[22]=true;
    tipusok[24]=true;
    tipusok[25]=true;
    set<string> agazatok;
    y << "{" << endl;
    y << "   \"d\":{" << endl;
    y << "      \"results\":[" << endl;
    while (!x.eof()){
        getline(x, s1);
        r=q=0;
        for (int i=0; i<=25; i++){
            data[i]="";
        }
        while (r<s1.length()){
            if (s1[r]!='"') data[q]+=s1[r];
            r++;
            if (s1[r]=='\t'){
                //cout << data[q] << endl;
                if (q==9) agazatok.insert(data[q]);
                q++;
                r++;
            }
        }
        //cin.get();

        p++;
        if (p%20==0){
            for (int i=0; i<=25; i++){
                cout << data[i] << " ";
                data[i]="";
            }
            cout << endl;
            cin.get();
        }
        //cout << p << "   ---   " << q << endl << endl;
        if (q!=25 && q!=12) cin.get();
        if (q==25) t++;
        if (p==0){
            for (int i=0; i<=25; i++){
                oszlopok[i]=data[i];
            }
        }
        if (p>0){
            y << "         {" << endl;
            y << "            \"__metadata\":{" << endl;
            y << "               \"uri\":\"https://oktnb132.inf.elte.hu:51010/company.xsodata/COMPANY()\"," << endl;
            y << "               \"type\":\"default.COMPANYType\"" << endl;
            y << "            }," << endl;
            for (int i=0; i<=24; i++){
                if (tipusok[i]){
                    y << "            \"" << oszlopok[i] << "\":" << data[i] << "," << endl;
                }
                else {
                    y << "            \"" << oszlopok[i] << "\":\"" << data[i] << "\"," << endl;
                }
            }
            y << "            \"ASZ_EVE\":" << data[25] << endl;
            if (p!=5174){
                y << "         }," << endl;
            }
            else {
                y << "         }" << endl;
            }
        }
    }
    cout << t << endl;
    y << "      ]" << endl;
    y << "   }" << endl;
    y << "}";
    //cout << data[1][5] << " " << data[100][20] << endl;
    return 0;
} */
