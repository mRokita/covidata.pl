# Podstawowe informacje o wirusie 
Dla wielu ludzi wciąż jest to kwestia niejasna, a niepoprawnie używane terminy w mediach nie pomagają się odnaleźć w tym terminologicznym bałaganie. 
Sprawa jest jednak prosta:

**Coronavirus (koronawirus)** - Nazwa gatunków wirusów należących do pewnej grupy (podrodziny Coronavirinae). Swoją nazwę zawdzięczają charakterystycznemu kształtowi, zaobserwowanemu przy oglądaniu go pod mikroskopem elektronowym. 

> W internecie znajdziecie wiele zdjęć wirusa zrobionych za pomocą mikroskopu elektronowego. Kolory pokazane na zdjęciach nie są ich rzeczywistymi kolorami. Odpowiadają jedynie pewnych cechom zmierzonym przez urządzenie w danym punkcie - na przykład różnym typom cząsteczek

**SARS-CoV-2** - Można powiedzieć, że to TEN koronawirus, o którym wszyscy mówią. Jest to konkretny gatunek wirusa, który powoduje stan aktualnej pandemii. Jest to skrótowiec od *Severe Acute Respiratory Syndrome CoronaVirus 2*. Początkowo był on nazwany nCoV-2019 (*new CoronaVirus*), lecz po wykonaniu dokładniejszych badań nazwa została zmieniona.

**COVID-19** - nazwa choroby wywoływanej przez wirusa SARS-CoV-2

Koronawirusy są bardzo powszechne. Szacuje się, że ich obecność jest przyczyną 10-30% przeziębień. Znanych jest 7 głównych gatunków, z których większość nie jest groźna. Wirusy tego rodzaju bardzo szybko mutują, co wywołało stan epidemiczny już 3 razy w XXI wieku. Mowa tu o wirusach SARS (2003), który spowodował ok. 1000 zgonów oraz MERS (2015), który zabił ok. 850 osób. Naukowcy szacują, że pierwsze koronawirusy pojawiły się na Ziemi ok. 11 tysięcy lat temu. 

SARS-CoV-2 znacząco różni się od poprzedników - jest mniej groźny dla zdrowia, za to bardziej zaraźliwy. Ma także dłuższy okres inkubacji niż reszta koronawirusów (jak i w ogóle powszechnych chorób). 

Wirusa SARS-CoV-2 pierwszy raz zidentyfikowano w chińskim mieście Wuhan 29.12.2019. 

### Współczynnik reprodukcji
Współczynnik reprodukcji wirusa, oznaczany jako R0, to średnia liczba osób zarażana przez jednego nosiciela wirusa. R0 w przypadku SARS-CoV-2 jest dość trudne do wyznaczenia między innymi przez nieznaną liczbę osób, które są faktycznie zarażone. Wiadomo, że ok. 80% nosicieli wirusa przechodzi chorobę bardzo lekko lub bezobjawowo, a co z tego wynika, nasza wiedza o nich jako nosicielach jest bardzo ograniczona. Również ich udział w zarażaniu reszty społeczeństwa jest prawdopodobnie znacznie większy niż osób przechodzących chorobę ciężej. 

R0 również zmienia się w czasie, zależy między innymi od social-distancingu, restrykcji w przemieszczaniu, regionu. Nie wyklucza się, że zależy również od czynników związanych z samym nosiecielem, na przykład wieku.

W marcu The Imperial Collage oszacowało R0 zagrażającego nam koronawirusa na **wartość z przedziału 1.5-3.5**.

R0 jest kluczowym parametrem opisu krzywych opisanych poniżej. Kiedy R0 przekracza wartość 1, epidemia cały czas jest w fazie wybuchu. Gdy R0 spada poniżej 1, epidemia zaczyna wygasać, aż do wyzerowania się wartości R0 (koniec epidemii). Ze względu na różnorodność krzywych w różnych regionach świata, dokładniejsze pomiary R0 muszą odnosić się do konkretnego społeczeństwa. 

**Polskie władze nie udostępniają dokonywanych pomiarów współczynnika reprodukcji**.


### Krzywe i ich spłaszczanie

Chyba każdy z nas słyszał w ciągu ostatniego miesiąca o "spłaszczaniu krzywej".
COVID-19 ma jednak kilka różnych krzywych. Główną krzywą, którą śledzimy jest krzywa zachorowań, której wcale nie da się spłaszczyć, bo jest niemalejąca! Jest to całkowita liczba zachorowań od początku epidemii do danego momentu w czasie. Wykres zachorowań na stan 13.04:

Badania epidemiologiczne wskazują, że krzywa zachorowań dąży do krzywej logistycznej: 

![alt text](https://i.ibb.co/Kz7xRnw/iinfografika2.png)

Kolejną krzywą, o której możemy mówić to krzywa wyzdrowień (i analogiczna krzywa zgonów), również dążąca do krzywej logistycznej. Z tych dwóch możemy skonstruować krzywą aktywnych zachorowań, przedstawiającą ilość osób chorych w danym dniu. Jest to po prostu różnica całkowitej liczby zachorowań i wyzdrowień lub zgonów dla danego dnia, dąży zatem do różnicy krzywych logistycznych o różnych parametrach. 

Ostatnią ważną krzywą jest dzienna liczba nowych przypadków. Osoby obeznane z analizą matematyczną mogą zauważyć, że jest do zdyskretyzowana pochodna funkcji całkowitych zachorowań po czasie (a raczej funkcji, do której dąży). Innymi słowy: pokazuje, jak szybko rośnie całkowita liczba zachorowań. Dąży ona do pochodnej funkcji logistycznej.

### Którą krzywą chcemy "spłaszczyć"?

Prosta odpowiedź brzmi: **wszystkie**

Przede wszystkim skupiamy się na ostatniej krzywej, czyli przyroście nowych zdiagnozowanych, głównym celem jest jednak spłaszczenie krzywej aktywnych zachorowań. 

Ponieważ system opieki zdrowotnej ma swoje sztywne ograniczenia, takie jak ilość sprzętu medycznego, miejsc w szpitalach i lekarzy, to po przekroczeniu tej granicy spowodowanym zbyt dużą ilością chorych w danym momencie, szanse na przeżycie choroby u osób, dla któych zabrakło środków medycznych drastycznie maleją, rośnie zatem śmiertelność samej choroby w tym regionie (dowiedz się więcej w sekcji *Zagrożenie i śmiertelność*).

Jak już wiemy, krzywa aktywnych zachorowań jest różnicą dwóch przesuniętych krzywych logistycznych: krzywej całkowitych zachorowań i przypadków wyleczeń lub zgonów. Są 3 odmienne sposoby, którymi jesteśmy w stanie to wykonać: zmniejszenie odległości między krzywymi, zmniejszenie ich wysokości lub zmniejszenie ich nachylenia. 

Za wysokość krzywych odpowiada całkowita liczba zarażeń - ciężko podać w tej chwili konkretny sposób jej minimalizacji.
Za odległość między krzywymi odpowiedzialny jest oczekiwany czas trwania choroby. W zmniejszeniu go mogą pomóc na przykład nowe leki czy sposoby kuracji chorych. Obecnie wielu specjalistów zajmuje się próbą wypłaszczania krzywej w ten sposób, lecz przeciętny obywatel niewiele jest tu w stanie pomóc.


**Jest za to w stanie pomóc zmniejszyć nachylenie krzywej - za które odpowiada właśnie dzienna ilość nowych przypadków.**


![alt text](https://i.ibb.co/f9h6cqz/infografika5-2.png)




Skrócony sposób rozumowania przebiega zatem w ten sposób:

&nbsp;&nbsp;Spłaszczenie krzywej nowych zachorowań **-->** 

&nbsp;&nbsp;&nbsp;&nbsp;Zmniejszenie nachylenia krzywej całkowitych zachorowań **-->** 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Spłaszczenie krzywej aktywnych przypadków 

W ten sposób doszliśmy do sposobu spłaszczenia krzywej aktywnych przypadków w sposób, w którym każdy z nas może uczestniczyć - w spłaszczeniu liczby nowych  przypadków pomagamy po prostu nie dając się zarazić oraz starając się nie zarazić innych! 

Podsumowując: nie wiadomo, czy się zarazisz, czy nie. Postaraj się jednak tego nie robić (spłaszcz pierwszą krzywą), a przynajmniej zrobić to jak najpóźniej (spłaszcz trzecią krzywą). Spłaszczanie dowolnej z nich pomaga spłaszczyć drugą, czyli najważniejszą z punktu widzenia minimalizacji zagrożeń zdrowotnych wynikających z choroby. 

### Ograniczenia
Krzywa zachorowań dąży do logistycznej jedynie w warunkach idealnych. Ogranicza się to do:
* Jednej społeczności
* Niemienności warunków zewnętrznych

Co to zmienia?
Otóż każde zamknięty obszar będzie mieć "własną" krzywą zarażeń. Patrząc na obecną sytuację wydaje to się dość oczywiste - we Włoszech jest przecież znacznie więcej zarażeń niż w Polsce w przeliczeniu na mieszkańca. 

Przez to, że każdy obszar generuje krzywą o różnych parametrach, a krzywa globalna jest ich sumą, to **nie dąży ona** do krzywej logistycznej.

![alt text](https://i.ibb.co/gPQQFSN/infografika1-1.png)


Jednak każdy kraj zajmuje się przede wszystkim spłaszczaniem własnej krzywej oraz ograniczaniem kontaktów z krajami o gorszej sytuacji epidemiologicznej. 

Zmiana warunków zewnętrznych to na przykład restrykcje wprowadzane w danym rejonie, nastrój społeczny czy choćby zmiana pogody. Taka zmiana w trakcie epidemii może wywołać zmianę parametrów opisującej zachorowania funkcji logistycznej, co znacznie utrudnia dokonywanie jakichkolwiek przewidywań, lecz nie wpływa na ogólny trend oraz sposoby przeciwdziałania. 

### Wzrost wykładniczy
W wielu miejscach możemy znaleźć informację, że pandemia rozwija się wykładniczo. Tutaj postulujemy z kolei, że jest to wzrost logistyczny. Czy to to samo?

Odpowiedź brzmi: **nie do końca.**

![alt text](https://i.ibb.co/GCYnsLd/iinfografika3.png)

Przyjrzyjmy się dokładniejszemu opisowi tych dwóch wzrostów. 

Wzrost wykładniczy to taki, w którym każdego kolejnego dnia liczba zarażeń jest o stały procent większa niż dnia poprzedniego. W przypadku epidemii nie jest to całkowicie poprawny opis, jak wszyscy wiemy epidemia się bowiem kiedyś skończy (w najgorszym wypadku skończą się ludzie, którzy mogą się jeszcze zarazić). 

Porównując jednak wykresy funkcji wykładniczej i logistycznej można jednak zauważyć, że **na początku** oraz **na końcu** epidemii ich wykresy praktycznie się pokrywają. Jeśli więc czytaliście artykuł na początku epidemii o wykładniczym wzroście, to nie był on zasadniczo nieprawdziwy. W końcu funkcja logistyczna również jest jedynie przybliżeniem faktycznie działającej ogromnej ilości nachodzących się procesów, wyznaczających rzeczywisty przebieg katastrofy.

![alt text](https://i.ibb.co/hgbvpjg/infografika4-2.png)


Rozpatrując jednak środek epidemii, blisko którego prawdopodobnie znajdujemy się w chwili pisania tego opracowania (13.04), należy myśleć bardziej o wzroście czy spadku logistycznym, nie wykładniczym, opis ten jest bowiem trochę mniej intuicyjny, lecz jak się okazuje bardziej trafny.


### Jak krzywa logistyczna opisuje historię zachorowań w Chinach

Jeśli przyrównamy wykres skumulowanych zachorowań w Chinach do krzywej logistycznej to wydaje się... nie pasować. 

Wykrywanie nowych przypadków, szczególnie w pierwszej fazie epidemii, nie jest proste. Znacznie prostsze jest jednak badanie ilości osób wyleczonych! Nie mamy tu błędów wynikających z trudności w diagnozie choroby, okresu inkubacji, strachu ludzi przed przyznaniem się do choroby czy późnym zgłaszaniu się do lekarza. Wszystkie te czynniki bardzo zaburzają poprawne gromadzenie danych o ilości dziennych zachorowań, jednak odbija się na niej tendencja wyzdrowień, którą mierzymy znacznie lepiej.

![alt text](https://i.ibb.co/cN1nhJd/infografika6.png)

Przyglądając się wykresom przebiegu pandemii w Chinach dobrze widać to zjawisko - niezrównoważony wykres zachorowań, bardzo narażony na błędy pomiaru i konsekwentny wykres wyzdrowień, dużo prostszy do wyznaczenia. 



