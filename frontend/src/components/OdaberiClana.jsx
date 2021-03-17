import {React,Fragment} from 'react'
import {Typography,Box,Select,InputLabel,MenuItem,FormControl,Button,IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
const useStyles=makeStyles((theme)=>({
    odaberiClanaBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        margin:'0.1rem auto',
        width:'90%'
      },

}))
function OdaberiClana({tip,index,clanovi,setClanovi,preostaliClanovi,setPreostaliClanovi}) {   //SELECT komponenta koja se izlistava kada zelimo dodati 1 clana pa ga trebamo selektirati
//index da znamo koji clan niza ODABRANIH(KOJEG ČINE KOMPONENTE ZA IZLIST IGRAČA ILI ZA SELEKTIRANJE) maknuti odnosno promijeniti iz null u odabranog clana nakon selektrianja
const classes=useStyles();
function prikaziOdabranogClana(clan,tip,index)//POZIVA SE NAKON ŠTO SELEKTIRAMO IGRAČA KOJEG ŽELIMO DODATI->index na kojem trebamo zamijeniti clana koji je trenutno null i postaviti ga na novog
{//clan= OBJEKT KOJI SADRŽI ODABANOG ČLANA IZ MENU ITEMA ODNOSNO NJEGOV VALUE
    if(tip===1||tip===2)//igrac
    {
      let new_array1=preostaliClanovi.filter((clanovi)=> clanovi.maticni_broj!==clan.maticni_broj);//ukloni ga iz preostalih jer je odabran
      let new_array2=clanovi;
      new_array2[index]={//zamijeni null koji je na tom mjestu
        maticni_broj:clan.maticni_broj,
        broj_dresa:clan.broj_dresa,
        ime:clan.ime,
        prezime:clan.prezime
      };
      setPreostaliClanovi(new_array1);
      setClanovi(new_array2);//ovo će ponovno renderirat sve odabrane igrace i umjesto prijasnjeg selecta ce prikazat odabranog igraca
    }
    else//trener,tehniko,sluzbeni predstavnik ili fizio-> nema preostalih,samo postavi stanje clana
    {
        setClanovi({
            maticni_broj:clan.maticni_broj,
            ime:clan.ime,
            prezime:clan.prezime
        })
    }

}
function ukloniOdabirClanaTima(tip,index)//poziva se kada zelimo maknuti SELECT komponentu za odabir igraca
{
      if(tip===1||tip===2)//igrac
      {
        let new_array=[],e=0;
        for(let i=0;i<clanovi.length;i++)
        {
          if(i!==index)//ostavimo sve osim onog clana s poslanim indexom
          {
            new_array[e]=clanovi[i];
            e++;
          }
        }
        setClanovi(new_array);
        //ne trebamo vraćat ništa u niz preostalih jer ovde nije nista odabrano
      }
      else
      {
          setClanovi({});//u ovom slučaju neće ništa iscrtati fukncija renderodabraniTrener
      }
    
}
return (
    <Fragment>
      {
        (()=>{
            if(tip===1||tip===2)//igrac
            {
              return (
                <Box className={classes.odaberiClanaBox}>
                  <FormControl style={{width:'80%',margin:'0 auto',flexGrow:1}}>{/*event.target.value sadrzi maticni broj odabranog clana*/}
                  <InputLabel >{(tip===1)? 'ODABERI IGRAČA' : 'ODABERI GOLMANA'}</InputLabel>
                  <Select onChange={(event)=>prikaziOdabranogClana(event.target.value,tip,index)} >
                    {
                    preostaliClanovi.map((clan)=>{
                      return <MenuItem key={clan.maticni_broj} value={clan}><Typography color='secondary'>{clan.maticni_broj+' '+clan.ime+' '+clan.prezime}</Typography></MenuItem>
                    })
                    }
                  </Select>
                  </FormControl> {/*saljemo index na kojem se nalazi u nizu ,klub kojem pripada i rolu kkao bi znali iz kojeg niza unutar kluba ga treba izbrisati*/}
                  <IconButton onClick={()=> ukloniOdabirClanaTima(tip,index)} title='Ukloni' color='secondary'  disableRipple><RemoveCircleIcon/></IconButton>
                </Box>              
              )
            }
            else
            {
              return (
                <Box className={classes.odaberiClanaBox}>
                  <FormControl style={{width:'80%',margin:'0 auto',flexGrow:1}}>{/*event.target.value sadrzi maticni broj odabranog clana*/}
                  <InputLabel >{(()=>{
                       if(tip===3)
                       {
                           return 'ODABERI TRENERA'
                       }
                       else if(tip===4)
                       {
                           return 'ODABERI SLUŽBENOG PREDSTAVNIKA'
                       }
                       else if(tip===5)
                       {
                           return 'ODABERI TEHNIKA'
                       }
                       else return 'ODABERI FIZIOTARAPEUTA'

                    })()}</InputLabel>
                  <Select onChange={(event)=>prikaziOdabranogClana(event.target.value,tip,index)} >
                    {
                        preostaliClanovi.map((clan)=>{/*u ovom slucaju su preostali clanovi zapravo svi moguci treneri,njih saljemo ko propove */                    
                      return <MenuItem key={clan.maticni_broj} value={clan}><Typography color='secondary'>{clan.maticni_broj+' '+clan.ime+' '+clan.prezime}</Typography></MenuItem>
                    })
                    }
                  </Select>
                  </FormControl> {/*saljemo index na kojem se nalazi u nizu ,klub kojem pripada i rolu kkao bi znali iz kojeg niza unutar kluba ga treba izbrisati*/}
                  <IconButton onClick={()=> ukloniOdabirClanaTima(tip,index)} title='Ukloni' color='secondary'  disableRipple><RemoveCircleIcon/></IconButton>
                </Box>              
              )
            }
        })()
      }
    </Fragment>
  )
}

export default OdaberiClana
