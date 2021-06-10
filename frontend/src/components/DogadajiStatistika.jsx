import React,{Fragment,useEffect,useState} from 'react'
import {Box,Select,MenuItem,FormControl,ListItemText,Checkbox,Chip,Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import DogadajBox from '../components/Dogadaj.jsx';
import {noviDogadaj,brisiDogadaj} from '../graphql/subscription';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useQuery } from '@apollo/client';//hook za poziv querya
import {dohvatiSveDogadajeUtakmice} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
const useStyles=makeStyles((theme)=>({
    tijekUtakmiceBox:{
        display:'inline-flex',
        flexDirection:'column',
        borderColor:theme.palette.secondary.main,
        borderStyle:'solid',
        backgroundColor:theme.palette.primary.main,
        width:'100%',
        minHeight:500
      },
      chipListBox:{
        display:'flex',
        flexWrap:'wrap'//da se wrapaju u novi red
    }
}))
function DogadajiStatistika({brojUtakmice,live}) {//inace preko useEffecta dohvat
    const classes=useStyles();

    const { loading, error, data,subscribeToMore,refetch } = useQuery(dohvatiSveDogadajeUtakmice,{
        variables:{
            broj_utakmice:brojUtakmice
        }
    });
    const [sviTipoviDogadaja,setSviTipoviDogadaja]=useState([
        {
            id:1,
            naziv:"Golovi"
        },
        {
            id:2,
            naziv:"Timeouti"
        },
        {
            id:3,
            naziv:"Ostalo"
        }
    ])
    const [odabraniTipoviDogadaja,setOdabraniTipoviDogadaja]=useState(sviTipoviDogadaja);//inicijalno prikazujemo sve tipove događaja
    /*console.log(sviTipoviDogadaja[0]===odabraniTipoviDogadaja[0]);
    MATERIAL UI MULTIPLE SELEECT ZA SLUCJEVE KADA JE VALUE=OBJEKT RADI USPOREDBU NOVIH I STARIH OBJEKATA NA NAČIN DA USPOREDI OBJEKTE SA A===B-> OVA USPOREDBA SE NA BAZIRA NA 
    ATRIBUTIMA NEGO GLEDA JE LI OVE 2 REFERENCE POKAZUJU NA ISTIT OBJEKT U MEMORIJI-> kada stavimo u useState ove objekte oni se kopiraju po referenci-> ne rade se kopije nego se samo pohrane referenca
    pa će zato bit ista referenca i isti objekt u slučaju usporedbe
    KADA BI sviTipoviDogadaja isli stavit kao obična niz imali bi problem:
    1) u prvom rerenderu bi se napravija taj niz u bmemoriji i odabraniTipoviDogadaja bi pokazivali na isti taj niz-> usporedba=true
    -> problem bi nastao u sljedećeme rerenderu kada bi se napravio NOVI NIZ A STARI BI ILI OSTAO KAO MEMORY LEAK ILI BI GA SKUPIO GARBAGE COLLECTOR OD JS ENGINEA
    -> U TOM SLUČAJU BI USPOREDBA BILA flase JER JE STATE OSTAO TRAJNO POHRANJEN I POKAZUJE NA ONE OBJEKTW IZ PRVOG RENDERA/MOUNTANJA
    -> ZATO BI KOD MULTIPLE SELECTA KAD GBI STISLI ELEMENT KOJI JE VEC PRISUTAN U VALUE OD SELEECT ON BI GA PONOVO DODA JER BI DOLI MENUITEMI BILI RADENI PREKO NIZA OBJEKATA KOJI SE NANOVO STVORI
    KOD SVAKOG RENDERA->VALUE OD MENUTIEMA BI POKAZIVAO NA OBJEKTE TOG NOVOSTVORENOG NIZA KOD SVAKOG RENDERA I USPOREDBA BI DALA flase-> zaključili bi da je različitzt objekt od postojećih i DODALI BI GA U LISTU IAKO VEĆ POSTOJI*/
    const subscribeNoviDogadaj=()=>subscribeToMore({
        document:noviDogadaj,
        variables:{
            broj_utakmice:brojUtakmice
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            let noviNiz=[];
            for(let i=0;i<prev.dogadajiutakmice.length;i++)
            noviNiz.push(prev.dogadajiutakmice[i]);
            noviNiz.push(subscriptionData.data.novidogadajutakmice);
            return {
                dogadajiutakmice:noviNiz
            }
        }

    });

    const subscribeBrisiDogadaj=()=>subscribeToMore({
        document:brisiDogadaj,
        variables:{
            broj_utakmice:brojUtakmice
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            let noviNiz=[];
            if(subscriptionData.data.brisidogadajutakmice.dogadaj.tip===1)
            {
                //ako je izbrisan dogadaj promjene rezultata-> u bazi su promijenjei svi prethodni rezultati-> refetchamo sve nove dogadaje s promjenjenima
                refetch();
                return prev;
            }
            else {
                noviNiz=prev.dogadajiutakmice.filter((dogadaj)=>dogadaj.id!==subscriptionData.data.brisidogadajutakmice.id);
                return {
                    dogadajiutakmice:noviNiz
                }
            }
        }
    })
    function handleSelect(event){
        setOdabraniTipoviDogadaja(event.target.value);

    }
    useEffect(()=>{
        if(live)//ako je kod live prikaza onda se subscribamo, ako je staticki prikaz gotove utakmice onda nema subscriptiona
        {
            refetch();
            subscribeNoviDogadaj();
            subscribeBrisiDogadaj();
        }
    },[]);
    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(loading) return  (<CircularProgress color='primary'/>)

    if(data)
    {
        return (
        <Fragment>
        <FormControl style={{width:'90%',marginBottom:10}}>
            <Typography align='center' variant='h5' color='secondary'>DOGAĐAJI TIP</Typography>
                <Select
                multiple
                value={odabraniTipoviDogadaja}//po defaultu svi odabrani
                onChange={(e)=>handleSelect(e)} 
                renderValue={(odabrani)=>//isa vrijednost kao value u Select komponeneti
                    (<div className={classes.chipListBox}>
                            {
                            odabrani.map((tip)=>(
                            <Chip style={{margin:3}} key={tip.id} label={tip.naziv}/>)
                            )
                            }
                    </div>)
                }>
                {
                sviTipoviDogadaja.map((tip)=> 
                (<MenuItem key={tip.id} value={tip}>
                    <Checkbox checked={odabraniTipoviDogadaja.find((odabrani)=>odabrani.id===tip.id)!==undefined} />
                    <ListItemText primary={tip.naziv} />
                </MenuItem>))
                }
                </Select>
            </FormControl>
            <Box className={classes.tijekUtakmiceBox}>
                                {data.dogadajiutakmice&&data.dogadajiutakmice.map((dogadajutk)=>{
                                    if(dogadajutk.dogadaj.tip===1&&(odabraniTipoviDogadaja.find((odabrani)=>odabrani.id===1)!==undefined))//prikazi dogadaje tipa1 AKO JE KORISNIK ODABRA DA IH ZELI PRIKAZAT-> MORAJU BIT PRISUTNI U LISTI ODABRANIH DOGADAJA
                                    {
                                        return <DogadajBox key={dogadajutk.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} domaci={dogadajutk.rez_domaci} gosti={dogadajutk.rez_gosti} ime={dogadajutk.akter.ime} prezime={dogadajutk.akter.prezime} dogadaj={dogadajutk.dogadaj.naziv} tip={1} />
                                    }
                                    else if(dogadajutk.dogadaj.tip===2&&(odabraniTipoviDogadaja.find((odabrani)=>odabrani.id===2)!==undefined))
                                    {
                                        return <DogadajBox key={dogadajutk.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} dogadaj={dogadajutk.dogadaj.naziv} tip={2}/>
                                    }
                                    else if(dogadajutk.dogadaj.tip===3&&(odabraniTipoviDogadaja.find((odabrani)=>odabrani.id===3)!==undefined))
                                    {
                                        return <DogadajBox key={dogadajutk.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} ime={dogadajutk.akter.ime} prezime={dogadajutk.akter.prezime} dogadaj={dogadajutk.dogadaj.naziv} tip={3}/>
                                    }
                                    else return null;
                                })}
                </Box>
        </Fragment>
        )
    }
}

export default DogadajiStatistika
