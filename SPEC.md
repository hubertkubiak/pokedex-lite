# Specyfikacja: Pokédex Lite (jednowidokowa aplikacja)

## 1. Cel

Jednowidokowa aplikacja dla fanów Pokémonów. Działa w przeglądarce, bez backendu. Dane pobiera wyłącznie z publicznego PokeAPI (https://pokeapi.co), które nie wymaga klucza.

**Stack:** React (CDN, UMD), Tailwind CSS (CDN). Jeden plik HTML, bez build stepu.

## 2. Zakres

### W zakresie
1. Dźwięki i animacje
2. Ewolucje
3. Porównywanie statystyk
4. Quizy
5. Wpis z Pokédexu

### Poza zakresem
- Pojedynek dwóch Pokémonów (także uproszczone porównanie z wynikiem)
- Kolekcje, zapisywanie „złapanych” Pokémonów, ulubione, localStorage
- Backend, konta użytkowników, logowanie
- Symulacja prawdziwych walk z mechanikami gry (typy ataków, ruchy, PP itd.)
- Wersja angielska lub przełącznik języka. Aplikacja działa wyłącznie po polsku.

## 3. Widok

Jeden ekran, podzielony na sekcje lub zakładki w obrębie tej samej strony:
- **Wyszukiwarka** (pole tekstowe z podpowiedziami po nazwie lub numerze)
- **Karta Pokémona** (obrazek, numer, nazwa, typy, wzrost, waga, statystyki, wpis z Pokédexu)
- **Panel funkcji:** Porównanie, Quiz, Ewolucje
- **Przycisk „Losuj”** (losowy Pokémon z zakresu 1–1025)

Nawigacja między funkcjami bez przeładowania strony. Zakładki lub przełącznik sekcji.

## 4. Funkcje szczegółowo

### 4.1 Dźwięki i animacje

**Dźwięki (cries):**
- Każdy Pokémon ma odgłos z PokeAPI (pole `cries`, format .ogg).
- Odtwarzanie na kliknięcie przycisku „Odtwórz krzyk”. Przeglądarki blokują autoodtwarzanie, więc bez automatycznego startu.
- Przycisk jest wyłączony, jeśli dany Pokémon nie ma pliku dźwiękowego.

**Animacje:**
- Wjazd karty Pokémona (płynne przejście przy zmianie).
- Efekt pojawienia się obrazka (fade/scale).
- Krótkie podskoki lub pulsowanie przy wylosowaniu lub po ewolucji.
- Wszystkie animacje przez klasy Tailwinda i `transition` / `animate-*`. Przy `prefers-reduced-motion` wyłączone.

### 4.2 Ewolucje

- Dla aktualnego Pokémona pokazywany jest pełny łańcuch ewolucji.
- Łańcuch zawiera nazwy i obrazki kolejnych etapów. Kliknięcie etapu ładuje go jako aktualnego Pokémona.
- Obsługa rozgałęzień: niektóre Pokémony mają kilka ewolucji (np. Eevee). Łańcuch trzeba pokazać jako drzewo, nie tylko listę.
- Przy każdej ewolucji podawany warunek (poziom, kamień, wymiana, przyjaźń itd.), jeśli PokeAPI go zwraca.
- Pokémon bez ewolucji: komunikat „Ten Pokémon nie ewoluuje”.

### 4.3 Porównywanie statystyk

- Źródło: pola `stats` w endpointcie `/pokemon/{id}`. Dostępne są: HP, Attack, Defense, Special Attack, Special Defense, Speed.
- Użytkownik wybiera 2 lub 3 Pokémony. Tabela lub paski pokazują wartości obok siebie.
- Najwyższa wartość w każdym wierszu wyróżniona.
- Wiersz sumy statystyk na dole.
- Bez wyniku „kto wygrywa”. To tylko zestawienie danych.

### 4.4 Quizy

Trzy tryby, każdy z licznikiem wyniku i serii poprawnych odpowiedzi:

**Kto to jest?**
- Pokazywana sylwetka Pokémona (obrazek z filtrem CSS, czarny cień).
- 4 propozycje nazw, jedna poprawna.
- Po odpowiedzi: pokazanie prawdziwego obrazka i nazwy.

**Który typ?**
- Pokazywany Pokémon, pytanie o jego typ (jeden lub dwa).
- Odpowiedzi jako przyciski z typami.

**Odgadnij po statystyce:**
- Podane są wzrost i waga, a użytkownik zgaduje Pokémona z 4 propozycji.

Wspólne zasady:
- Losowanie pytań z całej puli 1–1025.
- Nie powtarzać tego samego Pokémona w obrębie jednej serii.
- Przycisk „Zacznij od nowa” zeruje wynik.

### 4.5 Wpis z Pokédexu

- Pod obrazkiem Pokémona pokazany jest opis z gry (flavor text).
- Źródło: endpoint `/pokemon-species/{id}`, pole `flavor_text_entries`, filtr na język `pl`. Jeśli brak polskiego wpisu, pokaż komunikat zamiast opisu w innym języku.
- Opcjonalnie: przycisk „Pokaż inny wpis”, który przechodzi przez kolejne wpisy z różnych wersji gry.
- Tekst z PokeAPI zawiera znaki nowej linii i znaki specjalne. Trzeba je oczyścić przed wyświetleniem.

## 5. Źródło danych (PokeAPI)

| Dane | Endpoint |
|---|---|
| Pokémon (typy, statystyki, obrazki, dźwięk, wzrost, waga) | `/api/v2/pokemon/{id lub nazwa}` |
| Opis Pokédexu, łańcuch ewolucji | `/api/v2/pokemon-species/{id lub nazwa}` |
| Łańcuch ewolucji | `/api/v2/evolution-chain/{id}` (adres podany w species) |
| Lista nazw do wyszukiwarki | `/api/v2/pokemon?limit=1025` |

Dane nazw pobierane raz i cache'owane w pamięci, żeby nie wysyłać zapytań przy każdym wpisie w wyszukiwarce.

## 6. Obsługa błędów i stany

- **Ładowanie:** wskaźnik w miejscu danych, nie na całej stronie.
- **Błąd sieci lub API:** komunikat tekstowy z przyciskiem „Spróbuj ponownie”.
- **Brak danych (np. brak dźwięku, brak polskiego opisu):** ukryj element lub pokaż komunikat, bez psucia reszty widoku.
- **Nieistniejący numer lub nazwa w wyszukiwarce:** komunikat „Nie znaleziono Pokémona”.

## 7. Wymagania niefunkcjonalne

- Język interfejsu: wyłącznie polski (bez przełącznika języka).
- Responsywność: działa na telefonie (od ~380 px) i na desktopie.
- Dostępność: przyciski z czytelnymi etykietami, `alt` na obrazkach, kontrast zgodny z Tailwindem w ciemnym motywie.
- Wydajność: pobieranie danych tylko dla aktualnie oglądanych Pokémonów (plus lekkie prefetchowanie następnego przy losowaniu, opcjonalnie).

## 8. Kryteria akceptacji

- [ ] Każdy Pokémon ma działający przycisk dźwięku, a brak dźwięku nie psuje widoku.
- [ ] Ewolucje pokazują pełny łańcuch, w tym rozgałęzienia (np. Eevee).
- [ ] Tabela porównawcza pokazuje wszystkie sześć statystyk i sumę dla 2–3 Pokémonów.
- [ ] Wszystkie trzy quizy losują z całej puli 1–1025, liczą wynik i serię, a przycisk resetu czyści stan.
- [ ] Wpis z Pokédexu pokazuje polski tekst bez znaków nowej linii, a przy braku polskiego wpisu komunikat.
- [ ] Cały interfejs jest po polsku.
- [ ] Aplikacja działa bez backendu i bez klucza API.

## 9. Proponowana kolejność implementacji

1. Szkielet widoku, wyszukiwarka, karta Pokémona, wpis z Pokédexu
2. Porównywanie statystyk (tabela)
3. Ewolucje (łańcuch i rozgałęzienia)
4. Quizy
5. Dźwięki i animacje (dopieszczenie na końcu)

## 10. Otwarte pytania

Brak. Zakres i decyzje są ustalone.