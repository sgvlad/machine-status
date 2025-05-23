
## Introduction

Hi :wave:,

I really liked how this assignment is structured and the challenge that comes with it.
I avoided to contact you regarding some clarifications that I needed, in order to be more efficient.
That's why I did some assumptions like:
  - the time of a status changed is raw local time of the client machine.
  - there is enough memory. I didn't limit the number of stored machines or status changes or clean them after a period of time or a specific number.
  - I displayed the data as the websocket emits. Didn't use throttleTime or debounceTime to reduce the frequency of updates.

I am not happy with the machineSignalMap that I have created to avoid rendering of the DOM each time websocket emits.
Because of the time constraints I will leave this solution.

I would really like to know your thoughts and what were your expectations.

Best regards,
Vlad

