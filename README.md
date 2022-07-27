# dayify: Parse natural expressions of dates and times
Use this library to convert natural methods of date and/or time expression in English to luxon's `DateTime`.

Some examples of inputs that this library can process:

```
TOMORROW AT 7
next tuesday at midnight
2 days, 4 hours ago
July 21st, 2030 at 7:31pm
4 sep at quarter to 17
in an hour and 30 minutes
```

## API
Note that the main `input` string argument passed to each method is case-insensitive and will be trimmed.
### `suggest(input: string, direction: SearchDirection): DateTime[]`
Suggests luxon DateTimes based on the given input string. Only returns DateTimes in the given direction (`past`, `future`, or `both`). If both date and time seem to be specified, this function returns all the possible combinations of `DateTime`s. Otherwise, just returns dates or times, or if neither is clearly specified, returns an emoty array. In either case, `DateTime`s will be returned in order of which the library thinks was most likely meant by the input string.

### `suggestDate(input: string, direction: SearchDirection): DateTime[]`
Same functionality as `suggest`, except this function only parses expressions of date and only returns `DateTime`s with their hours set to `9` (9:00 AM).

### `suggestTime(input: string, direction: SearchDirection): DateTime[]`
Same functionality as `suggest`, except this function only parses expressions of time and only returns `DateTime`s that are today (with their hours and minutes set to appropriate values, and seconds set to 0).