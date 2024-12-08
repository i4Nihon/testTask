# /players
pobiera liste wszystkich graczy

# /players/[nazwaGracza]
pobiera konkretnego gracza

# /players/register
dodaje gracza do bazy danych *wyamaga headerów*

### headers: 
name: [nazwaGracza] 
player_team: [nazwaDrużyny(opcjonelne)] 
is_team_new: [czyTworzyDrużyne(opcjonelne)]

# /teams
pobiera liste wszystkich drużyn

# /players/[nazwaDrużyny]
pobiera konkretną drużyne

# /players/register
dodaje drużyne do bazy danych *wyamaga headerów*

### headers: 
name: [nazwaDrużyny] 
leader: [nazwaPrzywódcyDrużyny(musiIstniećJakoGracz)]