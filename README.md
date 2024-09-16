<h1>Ledrama GUI (Kandiprojekti)</h1>
<h2>Käyttöohje</h2>
 
<h3>Johdanto</h3>

Ledrama GUI on LED-valoputkien konfigurointiin ja valoefektien säätämiseen tarkoitettu helppokäyttöinen käyttölittymä. Valoputkien ohjainten (ESP32) konfigurointi tapauhtuu JSON-muotoisilla MQTT-viesteillä. Ledrama GUI:n avulla MQTT-viestit voidaan muodostaa ja lähettää ohjaimille muutamalla klikkauksella.
Sovelluksen avulla eri alueille asennetut valoputket saadaan säädettyä perusasetuksille nopeasti ja vaivattomasti. Ohjaimet voidaan liittää haluttuihin ryhmiin ja efektejä voidaan muokata putkien lukumäärän ja pituuden perusteella. Parhaat efektit voidaan tallentaa myöhempää käyttöä varten.
Lanien paras valoshow alkakoon!
 
<h3>Konfigurointi</h3>

Ohjainten konfigurointi tapahtuu Configuration-välilehdellä. Ohjaimet voidaan konfiguroida ohjattaviksi joko MQTT- tai Artnet-viestein. 
Ruudun vasemmassa reunassa on taulukko viime aikoina verkkoon rekisteröidyistä ohjaimista. Voit järjestää ohjaimet ohjainlaitteessa lukevan ID-numeron, ohjaimen MAC-osoitteen, laitetyypin, viimeisimmän rekisteröinnin tai ohjainryhmän perusteella klikkaamalla taulukon yläreunaa haluamasi otsikon kohdalta. Select all -painike valitsee kaikki ohjaimet, Remove selection -painike poistaa valinnat. 

<h3>MQTT</h3>

Ohjainten konfigurointi tapahtuu valitsemalla halutut ohjaimet taulukosta ja tämän jälkeen haluttu ryhmä Select group -pudotusvalikosta.
Halutessasi voit ilmoittaa myös ohjaimeen yhdistettyjen LED-putkien pituuden (LED type) ja määrän (Number of LED lights connected) sekä sen, moneenko strippiin eli pienempään ryhmään haluat jakaa putkien ledit (Number of strips (parts) to divide to).
Voit esikatsella MQTT-viestiä JSON preview -ikkunassa. Lähetä MQTT-viesti valituille ohjaimille klikkaamalla Apply-painiketta. 

<h3>Artnet</h3>

Ohjataksesi LED-putkia Artnet-komennoilla valitse Artnet-asetukset (Artnet settings). Valittuasi haluamasi ohjaimen voit säätää ohjaimen aliverkkojen ja avaruuksien määrää. Käytettyjen avaruuksien määrä yhtä ohjainta kohden on 6. Ohjaimen suurin pikselimäärä on 1020. Voit tarkistaa, kuinka monta valoa ohjaimeen voidaan liittää, valitsemalla LED-tyypin ja liitettyjen valojen määrän.
Paina Apply asettaaksesi avaruudet ja käynnistääksesi Artnetin kaikille niille valituille ohjaimille, joissa ”Artnet off” ei ole valittuna.
Voit poistaa Artnetin käytöstä valituilta ohjaimilla rastittamalla ”Artnet off”-valinnan ja lähettämällä viestin ohjaimille.

<h3>Efektien säätö</h3>

Efektien säätö tapahtuu Effect control -välilehdellä.

<h3>Efektien lataus ja tallennus</h3>

Lataa aiemmin tallennettu efekti valitsemalla se ruudun vasemman reunan efektilistasta. Voit etsiä efektiä kirjoittamalla sen nimen hakukenttään.
Tallenna luomasi tai muokkaamasi efekti klikkaamalla Save effect as -painiketta.

<h3>Efektiasetukset</h3>

Valitse haluamasi efektityyli (effect style) pudotusvalikosta. Valitse, mille ryhmälle haluat asettaa efektin (select group) ja klikkaa Apply-painiketta lähettääksesi valitun efektin ohjaimille. Tyhjennä valinnat klikkaamalla Clear all -painiketta.
<h4>BPM Cycling hue</h4>
Valot vilkkuvat sateenkaaren väreissä. Säädä vilkkumistempoa (BPM) ja efektin nopeutta (effect speed) liukukytkimellä tai kirjoittamalla haluttu luku syötekenttään. Efektin nopeus määrittää, kuinka nopeasti valojen väri vaihtuu. Huom! BPM-arvo 0 pimentää valot.
<h4>BPM Along Gradient</h4>
Valot vaihtavat väriä yhtä aikaa. Säädä tempoa (BPM) liukukytkimellä tai kirjoittamalla haluttu luku syötekenttään. Valitse halutut värit värivalitsimella.
<h4>BPM Traveling Gradient</h4>
Värit liikkuvat valoputkia pitkin. Voit halutessasi säätää valot vilkkumaan väriä vaihdettaessa. Säädä vilkkumistempoa (BPM) ja efektin nopeutta (effect speed) liukukytkimellä tai kirjoittamalla haluttu luku syötekenttään. Valitse halutut värit värivalitsimella.
<h4>Gradient</h4>
Värit liikkuvat valoputkia pitkin joko ylhäältä alas (top to bottom), alhaalta ylös (bottom to top), keskeltä reunoille (outwards from center) tai reunoilta keskelle (inwards to center). Valitse suunta Gradient mode -pudotusvalikosta. Säädä efektin nopeutta (effect speed) ja skaalausta (gradient scale) liukukytkimillä tai kirjoittamalla haluttu luku syötekenttään. Valitse halutut värit värivalitsimella.

Avaa kohinasäätimet klikkaamalla Add noise to effect -painiketta. Lisää efektiin kohinaa liukukytkimillä tai kirjoittamalla haluttu luku syötekenttään. Voit säätää kohinan määrää (noise amount), sävyä (noise hue), kylläisyyttä (noise saturation), kontrastia (noise contrast), kokoa (noise size) ja nopeutta (noise speed).

<h3>Värivalitsin</h3>

Käytä värivalitsinta efektin värien määrittelyyn. Säädä punainen (R), vihreä (G), sininen (B) ja alfa (A) välille 0–255, valitse väri värikartasta tai syötä haluamasi värin heksadesimaaliarvo (hex).

<h3>Efektin esikatselu</h3>

Käynnistä luomasi efektin esikatselu Preview effect -painikkeesta. Lopeta esikatselu Stop effect -painikkeesta.
 
<h3>Introduction</h3>

Ledrama GUI is an easy-to-use user interface for configuring LED light tubes and adjusting light effects. The configuration of the light pipe controllers (ESP32) takes place with MQTT messages in JSON format. With Ledrama GUI, MQTT messages are created and changed to controllers with only a click.
With the help of the application, the light tubes mounted to different areas can be set to basic settings quickly and effortlessly. The controllers can be connected to the desired groups and the effects can be based on the number and length of the tubes. The best effects can be saved for later use.
Let the best light show of the LAN party begin! 

<h3>Configuration</h3>

Controllers are configured on the Configuration tab. The controllers can be configured to be controlled by either MQTT or Artnet messages.
On the left side of the screen there is a table of recently registered controllers. You can organize the controllers based on the ID number on the controller device, the controller's MAC address, device type, latest registration, or controller group by clicking on desired title at the top of the table. The Select all button selects all controls, the Remove selection button removes selections.

<h3>MQTT</h3>

The controllers can be configured by selecting desired controllers from the table and then desired group from the Select group drop-down menu.
If you wish, you can also indicate the length (LED type) and number of the LED tubes connected to the controller, as well as whether you want to divide the LEDs of the tubes into many strips, or smaller groups.
You can preview the MQTT message in the JSON preview window. Send the MQTT message to the selected controllers by clicking the Apply button.

<h3>Artnet</h3>

To control LED tubes with Artnet commands, select Artnet settings. Default starting network, subnet and universe for first controller is 0. The number of universes used per controller is 6. The maximum amount of pixels a controller can handle is 1020. You can check how many lights can be connected to the controller by selecting the LED type and number of lights connected.
Pressing Apply will set the universes and turn Artnet ON for all the selected controllers, if Artnet off is not selected. If Artnet off is selected, Artnet will be turned off for the selected controller(s) without setting the universes.
 
<h2>Effect control</h2>

<h3>Loading and saving effects</h3>

Load a previously saved effect by selecting it from the effect list on the left side of the screen. You can search for an effect by typing its name in the search field.
Save the effect you created or edited by clicking the Save effect as button.

<h3>Effect settings</h3>

Select the desired effect style from the drop-down menu. Select which group you want to set the effect to (select group) and click the Apply button to send the selected effect to the controllers. Clear the selections by clicking the Clear all button. 

<h4>BPM Cycling hue</h4>
The lights flash in rainbow colors. Adjust the blinking tempo (BPM) and the effect speed with the slide switch or by typing the desired number in the input field. The speed of the effect determines how quickly the color of the lights changes. Note! A BPM value of 0 dims the lights.
<h4>BPM Along Gradient</h4>
The lights change color at the same time. Adjust the tempo (BPM) with the slide switch or by typing the desired number in the input field. Choose the desired colors with the color picker.
<h4>BPM Traveling Gradient</h4>
The colors move along the light tubes. If you want, you can set the lights to blink when changing the color. Adjust the blinking tempo (BPM) and the effect speed with the slide switch or by typing the desired number in the input field. Choose the desired colors with the color picker.
<h4>Gradient</h4>
The colors move along the light pipes either from top to bottom, bottom to top, outwards from center or inwards to center. Choose a direction from the Gradient mode drop-down menu. Adjust the effect speed and scaling with the sliders or by typing the desired number in the input field. Choose the desired colors with the color picker.

Click the Add noise to effect button to open the noise controls. Add noise to the effect with the sliders or by typing the desired number in the input field. You can adjust the noise amount, hue, saturation, contrast, size, and speed.

<h3>Color picker</h3>

Use the color picker to define the colors of the effect. Adjust Red (R), Green (G), Blue (B) and Alpha (A) between 0–255, select a color from the color chart or enter the hexadecimal (hex) value of the desired color.

<h3>Effect preview</h3>

Start previewing the effect you created by clicking the Preview effect button. Stop preview with the Stop effect button.
