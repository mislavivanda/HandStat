import {React,Fragment,useState} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Box,IconButton,Typography,Button} from '@material-ui/core';
import TimBoxComponent from './Tim_box_component';
import OdaberiClana from './OdaberiClana';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import SaveIcon from '@material-ui/icons/Save';
import { useSelector, useDispatch } from 'react-redux';
import {spremljenDomaci,spremljenGosti} from '../redux/slicers/timovi';
import { useQuery,useMutation } from '@apollo/client';
import {dohvatiSveClanoveTima} from '../graphql/query';
import { spremiRosterUtakmice} from '../graphql/mutation';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import ErrorDialog from './ErrorDialog';
import {postaviError} from '../redux/slicers/error';
const useStyles=makeStyles((theme)=>({
    klubBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
      },
    klubSlika:{
        height:'auto',
        width:'30%'
    },
    timBox:{
        position:'relative',
        display:'inline-flex',
        flexDirection:'column',
        minHeight:800,
        backgroundColor:theme.palette.primary.main,
        width:'100%'
    },
    titulaBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:theme.palette.secondary.main,
        margin:'0.5rem 1.5rem 1rem 1.5rem'
      },

}))
function TimVerticalBox({tim_id})
{
const classes=useStyles();
const timovi=useSelector(state=>state.timovi);
const dispatch=useDispatch();
const brojUtakmice=useSelector(state=>state.brojUtakmice);
const [timSviIgraci,setTimSviIgraci]=useState(null);//svi igraci koje primimo s backenda
const [timIgraci,setTimIgraci]=useState([]);//igraci koje smo ODABRALI
const [timPreostaliIgraci,setTimPreostaliIgraci]=useState(null);//preostali igraci koje nismo jos odabrali a nalaze se u selectu
const [timSviGolmani,setTimSviGolmani]=useState(null);
const [timGolmani,setTimGolmani]=useState([]);
const [timPreostaliGolmani,setTimPreostaliGolmani]=useState(null);
const [timSviTreneri,setTimSviTreneri]=useState(null);//mo??e biti vi??e trenera u klubu i mo??e se dogoditi da svakio od njih mo??e vodit utakmica
const [timTrener,setTimTrener]=useState({});//samo 1 mo??e biti,nije niz nego varijabla,to??nije objekt
//NE MO??E DODAVAT VI??E OD 1 TRENERA TO MU NE DOPU??TAMO PA AKO O??E DODAT NEKOG DRUGOG TENEERA MORA IZBRISAT PRETHODNO DODANOG TRENERA, KLIKNUT NA IKONU DODAJ CLANA I IZABRAT TOG TRENERA OD SVIH MOGUCIH
//NEMA POTREBE ZA NIZOM PREOSTALI TRENERI, ISTO VRIJEDI I ZA OSTALE TITULE GDJE MO??E BITI SAMO 1 ??LAN
const [timSviSluzbeni,setTimSviSluzbeni]=useState(null);//sluzbeni predstavnik
const [timSluzbeni,setTimSluzbeni]=useState({});
const [timSviTehniko,setTimSviTehniko]=useState(null);
const [timTehniko,setTimTehniko]=useState({});
const [timSviFizio,setTimSviFizio]=useState(null);
const [timFizio,setTimFizio]=useState({});
const [timSpremljen,setTimSpremljen]=useState(false);
const isError=useSelector((state)=>state.error);
const [errorMessage,setErrorMessage]=useState('');//da znamo koji tekst poslati error dialogu
function isEmpty(obj) {//custom utility funkcija koja gleda jeli objekt prazan-> ako jest onda ne iscrtavamo ni??ta odnosno return null
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
//KADA STISNEMO NA IKONU ZA DODAVANJE  IGRA??A/??LANA
function dodajClana(tip)//postavi/dodaj polje sa select komponentom u niz ODABRANIH IGRACA u kojoj ??e se nalazit u meniju svi ponu??eni igra??i
  {
      if(tip===1)//igrac
      {
        if(timPreostaliIgraci.length>0)//ne mo??emo dodavati komponentu za dodavanje igra??a ako smo ih ve?? sve odabrali
        {
        let new_array=[...timIgraci,null];//postavit cemo clan na null i dodat ga u niz pa ??emo promijenit state koji ce trigerat renderiranje svih odabranih igraca a dio di je null ce renderirat komponentu za selektiranje
        setTimIgraci(new_array);//ovo ??e triogerat ponovno renderiranje dolje kod funkcije renderOdabraniIgraci
        }
        else{
          setErrorMessage('Dodani su svi igraci');
          dispatch(postaviError(true));
        }
      }
      else if(tip===2)//golman
      {
        if(timPreostaliGolmani.length>0)
        {
          let new_array=[...timGolmani,null];
          setTimGolmani(new_array);
        }
        else{
          setErrorMessage('Dodani su svi golmani');
          dispatch(postaviError(true));
        }
      }
      else if(tip===3)//trener
      {//ako je ve?? odabran trener onda nema mogu??nosti dodavanja prije nego ga removea-> prikazat ce select komponentu samo ako nije odabran nijedan odnosno ako je state={}
        if(isEmpty(timTrener))//ako je prazan objekt {} u stateu onda jo?? nije odabran nijedan trener-> prikazi mu slekect komponentu tako da postavis state na null
        {
        setTimTrener(null);//ovo ??e renderat izbornik za select u funkciji renderOdabraniTrener
        }
      }
      else if(tip===4)//slu??beni predstavnik
      {
        if(isEmpty(timSluzbeni))
        {
        setTimSluzbeni(null);
        }
      }
      else if(tip===5)//tehniko
      {
        if(isEmpty(timTehniko))
        {
        setTimTehniko(null);
        }
      }
      else {
        if(isEmpty(timFizio))
        {
        setTimFizio(null);
        }
      }
}
function dodajSveIgraceGolmane(tip){//jedino njih mo??emo sve unijeti,ostale titule mo??e biti samo 1 ??lan
    //kada stisnemo na ikonu za dodat sve igrace se poziva ova funkcija
            if(tip===1)//igrac
            {
            setTimPreostaliIgraci([]);//ispraznjen,svi selektirani
            setTimIgraci(timSviIgraci);
            }
            else if(tip===2)//golmani,za svaki slucaj if i provjeru stavit
            {
              setTimPreostaliGolmani([]);
              setTimGolmani(timSviGolmani);
            }
}
const [spremiRoster,{loading:mutationLoading,error:mutationError}]=useMutation(spremiRosterUtakmice,{
  onCompleted(data){//vrati true ako je sve dobro, mora ne??to vratitit, ne treba nam to jer u slu??aju errora ??eo ga ishandleat dolje
    if(tim_id===1)//spremljen doma??i tim
    {
      dispatch(spremljenDomaci());
    }
    else dispatch(spremljenGosti());
    setTimSpremljen(true);//u oba slucaja postavi da je tim spremljen
  },
  onError:(error)=>{
    setErrorMessage(error.message);
    dispatch(postaviError(true));
  }
})
function spremiTim()//poziva se kada spremimo odabrane clanove tima za tu utakmicu-> postavimo globalni state da je zadani tim spremljen
{
  //provjeri polja-> barem 1 golman i 6 igra??a + trener prije spremanja
    if(timIgraci&&timIgraci.length<6)
    {
      setErrorMessage('Odaberite minimalno 6 igra??a');
      dispatch(postaviError(true));
    }
    else if(timGolmani&&!(timGolmani.length>0))
    {
      setErrorMessage('Odaberite barem 1 golmana');
      dispatch(postaviError(true));
    }
    else if(isEmpty(timTrener))//ako je prazan objekt
    {
      setErrorMessage('Odaberite trenera za utakmicu');
      dispatch(postaviError(true));
    }
    else{
      spremiRoster({
        variables:{
          broj_utakmice:brojUtakmice,
          klub_id:(tim_id===1)? timovi.timDomaci.id : timovi.timGosti.id,
          igraci_id:timIgraci.map((igrac)=>igrac.maticni_broj),//uzmi samo nizove idova odnosno maticnih brojeva
          golmani_id:timGolmani.map((golman)=>golman.maticni_broj),
          trener_id:timTrener.maticni_broj,
          sluzpredstavnik_id:(isEmpty(timSluzbeni))? null : timSluzbeni.maticni_broj,//ako nije odabran po??alji null
          tehniko_id:(isEmpty(timTehniko))? null : timTehniko.maticni_broj,
          fizio_id:(isEmpty(timFizio))? null : timFizio.maticni_broj
        }
      });
     
    }
}
//komponenta za rednerianje svih odabranih igraca-> RENDEIRAJU SE VE?? ODABRANI IGRA??I I SELECT MENIJI GDJE JO?? NISU ODABRANI IGRA??I
function RenderOdabraniIgraci(){
    return (
        <Fragment>
        {
          (()=>{
          if(timIgraci.length>0)//ako ima ne??to za rednrat onda renderaj,ina??e vrati null odnosno ni??ta ne renderaj
          {
          return(
       
          timIgraci.map((igrac,index)=>{
            if(igrac)//razlicit od null
            {                                                                                                                    //saljemo state odabrani clan koji ??e se mijenjati u timbox componenti nakon klika
            return <TimBoxComponent key={igrac.maticni_broj} maticni_broj={igrac.maticni_broj} dres={igrac.broj_dresa} ime={igrac.ime} prezime={igrac.prezime} klub={tim_id}  spremljenTim={timSpremljen} clanovi={timIgraci} setClanovi={setTimIgraci} preostaliClanovi={timPreostaliIgraci} setPreostaliClanovi={setTimPreostaliIgraci} tip={1}/>
            }//ako je igrac null onda on jo?? nije odabran i ??eka se da se on selektira-> vrati komponentu za selektiranje
            else return <OdaberiClana key={index} clanovi={timIgraci} setClanovi={setTimIgraci} preostaliClanovi={timPreostaliIgraci} setPreostaliClanovi={setTimPreostaliIgraci} tip={1} index={index} />
            })
          )
          }
          else return null;
        })()
      }
        </Fragment>
    )
}
function RenderOdabraniGolmani(){
  return (
    <Fragment>
    {
      (()=>{
      if(timGolmani.length>0)
      {
      return(
   
      timGolmani.map((golman,index)=>{
        if(golman)//razlicit od null
        {
        return <TimBoxComponent key={golman.maticni_broj} maticni_broj={golman.maticni_broj} dres={golman.broj_dresa} ime={golman.ime} prezime={golman.prezime} klub={tim_id} spremljenTim={timSpremljen} clanovi={timGolmani} setClanovi={setTimGolmani} preostaliClanovi={timPreostaliGolmani} setPreostaliClanovi={setTimPreostaliGolmani} tip={2}/>
        }//ako je igrac null onda on jo?? nije odabran i ??eka se da se on selektira-> vrati komponentu za selektiranje
        else return <OdaberiClana key={index}  clanovi={timGolmani} setClanovi={setTimGolmani} preostaliClanovi={timPreostaliGolmani} setPreostaliClanovi={setTimPreostaliGolmani} tip={2} index={index} />
        })
      )
      }else return null;
    })()
  }
    </Fragment>
)
}
function RenderOdabraniTrener()
{
  return (
    <Fragment>
      {
          (()=>{//domaci
              if(!timTrener)//ako je null onda iscrtaj za ODABIR TRENERA KOMPONENTU
              {
                return <OdaberiClana clanovi={timTrener} setClanovi={setTimTrener} preostaliClanovi={timSviTreneri} setPreostaliClanovi={setTimSviTreneri}   tip={3} />//kod ovih tipova su preostali igraci=svim igracima jer se ne moze birat vi??e od 1
              }
              else if(!isEmpty(timTrener))//ako je prazan onda ne iscrtavaj ni??ta
              {//ako nije prazan onda se u stateu nalazi trener pa ??emo iscrtat komponentu za prikaz trenera
                return <TimBoxComponent maticni_broj={timTrener.maticni_broj} ime={timTrener.ime} prezime={timTrener.prezime} klub={tim_id} spremljenTim={timSpremljen}  clanovi={timTrener} setClanovi={setTimTrener} preostaliClanovi={timSviTreneri} setPreostaliClanovi={setTimSviTreneri}  tip={3} />
              }
              else return null;
          })()
      }
    </Fragment>
  )
}
function RenderOdabraniSluzbeni()
{
  return (
    <Fragment>
      {
          (()=>{//domaci
              if(!timSluzbeni)//ako je null onda iscrtaj za ODABIR slu??beniog predstavnika KOMPONENTU
              {
                return <OdaberiClana clanovi={timSluzbeni} setClanovi={setTimSluzbeni} preostaliClanovi={timSviSluzbeni} setPreostaliClanovi={setTimSviSluzbeni}  tip={4} />
              }
              else if(!isEmpty(timSluzbeni))//ako je prazan onda ne iscrtavaj ni??ta
              {//ako nije prazan onda se u stateu nalazi trener pa ??emo iscrtat komponentu za prikaz slu?? predstavnika
                return <TimBoxComponent maticni_broj={timSluzbeni.maticni_broj} ime={timSluzbeni.ime} prezime={timSluzbeni.prezime} klub={tim_id} spremljenTim={timSpremljen}  clanovi={timSluzbeni} setClanovi={setTimSluzbeni} preostaliClanovi={timSviSluzbeni} setPreostaliClanovi={setTimSviSluzbeni} tip={4}/>
              }
              else return null;
          })()
      }
    </Fragment>
  )
}
function RenderOdabraniTehniko()
{
  return (
    <Fragment>
      {
          (()=>{//domaci
              if(!timTehniko)//ako je null onda iscrtaj za ODABIR tehnika KOMPONENTU
              {
                return <OdaberiClana clanovi={timTehniko} setClanovi={setTimTehniko} preostaliClanovi={timSviTehniko} setPreostaliClanovi={setTimSviTehniko}   tip={5} />
              }
              else if(!isEmpty(timTehniko))//ako je prazan onda ne iscrtavaj ni??ta
              {//ako nije prazan onda se u stateu nalazi trener pa ??emo iscrtat komponentu za prikaz tehnika
                return <TimBoxComponent maticni_broj={timTehniko.maticni_broj} ime={timTehniko.ime} prezime={timTehniko.prezime} klub={tim_id} spremljenTim={timSpremljen} clanovi={timTehniko} setClanovi={setTimTehniko} preostaliClanovi={timSviTehniko} setPreostaliClanovi={setTimSviTehniko} tip={5}/>
              }
              else return null;
          })()
      }
    </Fragment>
  )
}
function RenderOdabraniFizio()
{
  return (
    <Fragment>
      {
          (()=>{//domaci
              if(!timFizio)//ako je null onda iscrtaj za ODABIR tehnika KOMPONENTU
              {
                return <OdaberiClana clanovi={timFizio} setClanovi={setTimFizio} preostaliClanovi={timSviFizio} setPreostaliClanovi={setTimSviFizio} tip={6}/>
              }
              else if(!isEmpty(timFizio))//ako je prazan onda ne iscrtavaj ni??ta
              {//ako nije prazan onda se u stateu nalazi trener pa ??emo iscrtat komponentu za prikaz tehnika
                return <TimBoxComponent maticni_broj={timFizio.maticni_broj} ime={timFizio.ime} prezime={timFizio.prezime} klub={tim_id} spremljenTim={timSpremljen} clanovi={timFizio} setClanovi={setTimFizio} preostaliClanovi={timSviFizio} setPreostaliClanovi={setTimSviFizio} tip={6}/>
              }
              else return null;
          })()
      }
    </Fragment>
  )
}
//ovisno o tome jeli prosljeden 1 ili 2 kao tim_id saljemo query za clanove tima domaceg ili gostuju??eg tima
  const {loading:queryLoading,error:queryError,data}=useQuery(dohvatiSveClanoveTima,{//RENAMEAMO KOD DESTRUCTIRINGA PROOPERTY JER IMAMO LOADING,ERROR OD QUERYA I MUTACIJA PA IH JE POTREBNO RAZLIKOVAT
    variables:{
      klub_id:(tim_id===1)? timovi.timDomaci.id : timovi.timGosti.id
    },
    onCompleted(data){//IZVR??AVA SE NAKON USPJE??NOG DOHVATA PODATAKA-> U NJOJ POSTAVIMO SVE POTREBEN STATEOVE KAD STIGNU PODACI
      setTimSviIgraci(data.timclanovi.igraci);
      setTimPreostaliIgraci(data.timclanovi.igraci);//NAKON DOHVATA U PO??EKTU ISTI KAO I SVI IGRA??I JER NIJE JO?? NITKO ODABRAN
      setTimSviGolmani(data.timclanovi.golmani);
      setTimPreostaliGolmani(data.timclanovi.golmani);
      setTimSviTreneri(data.timclanovi.treneri);
      setTimSviSluzbeni(data.timclanovi.sluzbenipredstavnici);
      setTimSviTehniko(data.timclanovi.tehniko);
      setTimSviFizio(data.timclanovi.fizio);
    }
  });

  if(queryLoading) return null;

  if(queryError) return (<Alert severity="error">{queryError.message}</Alert>);

  if(data)
  {
    return (
       <Fragment>
                  <Box className={classes.klubBox}>
                      <img src={(tim_id===1)? timovi.timDomaci.klub_slika : timovi.timGosti.klub_slika} alt='ikona_kluba' className={classes.klubSlika}/>
                      <Typography color='secondary' align='center' variant='h4'>{(tim_id===1)? timovi.timDomaci.naziv : timovi.timGosti.naziv}</Typography>
                    </Box>
                    <Box className={classes.timBox}>
                        <Box className={classes.titulaBox}>{/*ako je spremljen tim za tu utakmicu onda je onemoguceno dodavanje*/}
                          <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajClana(1)} title="Dodaj igra??a" style={{color:'#FFFFFF',width:'15%',height:'auto'}}><PersonAddIcon/></IconButton>
                          <Typography  variant='h6' style={{color:'#FFFFFF'}}>IGRA??I</Typography>
                          <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajSveIgraceGolmane(1)}  title="Dodaj sve igra??e tima" style={{color:'#FFFFFF',width:'15%',height:'auto'}}><GroupAddIcon/></IconButton>
                        </Box>
                        {RenderOdabraniIgraci()}{/*rendder svih odabranih igraca iz DOMA??EG TIMA*/}
                        <Box className={classes.titulaBox}>
                          <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajClana(2)} title="Dodaj golmana" style={{color:'#FFFFFF',width:'15%',height:'auto'}}><PersonAddIcon/></IconButton>
                          <Typography  variant='h6' style={{color:'#FFFFFF'}}>GOLMANI</Typography>
                          <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajSveIgraceGolmane(2)} title="Dodaj sve golmane tima" style={{color:'#FFFFFF',width:'15%',height:'auto'}}><GroupAddIcon/></IconButton>
                        </Box>
                        {RenderOdabraniGolmani()}
                        <Box className={classes.titulaBox}>
                          <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajClana(3)} title="Dodaj trenera" style={{color:'#FFFFFF',width:'15%',height:'auto'}}><PersonAddIcon/></IconButton>{/*stavit marginu desnu taman za sirinu iconbuttona*/}
                        <Box style={{flexGrow:1,marginRight:'15%'}}><Typography align='center'  variant='h6' style={{color:'#FFFFFF'}}>TRENER</Typography></Box>
                        </Box>
                        {RenderOdabraniTrener()}
                        <Box className={classes.titulaBox}>
                          <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajClana(4)} title="Dodaj slu??benog predstavnika" style={{color:'#FFFFFF'}}><PersonAddIcon/></IconButton>
                          <Box style={{flexGrow:1,marginRight:'15%'}}><Typography align='center' variant='h6' style={{color:'#FFFFFF'}}>SLU??BENI PREDSTAVNIK</Typography></Box>
                        </Box>
                        {RenderOdabraniSluzbeni()}
                        <Box className={classes.titulaBox}>
                          <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajClana(5)} title="Dodaj tehnika" style={{color:'#FFFFFF'}}><PersonAddIcon/></IconButton>
                          <Box style={{flexGrow:1,marginRight:'15%'}}><Typography align='center' variant='h6' style={{color:'#FFFFFF'}}>TEHNIKO</Typography></Box>
                        </Box>
                        {RenderOdabraniTehniko()}
                        <Box style={{marginBottom:70}}>{/*margina da se ne preklopi sa save buttonom kad se dodaju igraci i fiziotarapeut onda titula box i select fizio stavljamo u zajedni??ki box i zjedno mi??emo od dna*/}
                          <Box className={classes.titulaBox}>
                            <IconButton disabled={(timSpremljen)? true : false} onClick={()=>dodajClana(6)} title="Dodaj fiziotarapeuta" style={{color:'#FFFFFF'}}><PersonAddIcon/></IconButton>
                            <Box style={{flexGrow:1,marginRight:'15%'}}><Typography align='center' variant='h6' style={{color:'#FFFFFF'}}>FIZIOTERAPEUT</Typography></Box> 
                          </Box>
                          {RenderOdabraniFizio()}
                        </Box>       {/*Set the bottom edge of the <div> element to 10px above the bottom edge of its nearest parent element with some positioning( u na??em slu??aju kako je tim box position relative a button box abosulte pozicionirat ??e se 10 px iznad donjeg bordera od tim boxa):*/}
                       {(()=>{
                          if(mutationLoading) return <CircularProgress color='primary'/>

                          //inace vrati save button
                          return (<Box style={{width:'100%',display:'flex',justifyContent:'center',bottom:10, alignItems:'center',marginLeft:'auto',marginRight:'auto',position:'absolute'}}>
                            <Button disabled={(timSpremljen)? true : false} onClick={()=>spremiTim()} disableRipple size='large' variant='contained' color='secondary' endIcon={<SaveIcon/>} title='Potvrdi momcad za utakmicu' > SPREMI</Button>
                          </Box>)
                       })()}
                    </Box>
                    {
                      (isError&&errorMessage)?//u slucaju errora pozivamo poopup
                      <ErrorDialog errorText={errorMessage}/>
                      :
                      null
                    }
            </Fragment>
    )
  }
}

export default TimVerticalBox
