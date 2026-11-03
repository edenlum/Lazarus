#!/usr/bin/env python3
"""Narrate a *verified excerpt* from Käte Lazarus's 5 May 1948 letter.

A prototype, not an archival recording. The words are from the 2006 Hebrew
translation of German letters. Dates and punctuation are adjusted for TTS.
This uses the Hila Hebrew neural voice via edge-tts (unofficial online access
to Microsoft's speech service). For production, use an authorized provider.
"""
from __future__ import annotations

import asyncio
import sys
import tempfile
from pathlib import Path

from pydub import AudioSegment
import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "audio" / "kaete-1948-05-05.mp3"
VOICE = "he-IL-HilaNeural"

# Sentences from PDF page 7, manually checked against the scan.
# Written-out dates/numbers improve Israeli Hebrew pronunciation;
# no events, inner thoughts or dialogue have been invented.
PARTS = [
    """חמישה במאי, אלף תשע מאות ארבעים ושמונה.

יקירי,

מכתבי מהאחד במאי כמובן עדיין מונח כאן,
אבל למרות זאת אני כותבת היום שוב,
כי מכתבך מספר ארבעים ושתיים, מהשישה עשר באפריל,
הגיע היום לאחר שמונה עשר ימים.

הוא כנראה כבר יותר משבוע בארץ, כי מאז לא נחת שום מטוס.

את יכולה לתאר לעצמך כמה שמחתי.
הדמעות זלגו כשקראתי את מילותיכם החמות,
שחדרו לעיני כמו דרך ערפל סמיך,
מאימת הימים האחרונים.""",
    """מאז יומיים יש הפסקת אש בקטמון,
והיום בשעה ארבע,
לאחר פקיעת ארבעים ושמונה השעות,
היא הוארכה על מנת לאפשר המשך המשא ומתן על שביתת נשק.

אינכם יכולים לתאר לעצמכם
עד כמה היומיים האלה אפשרו לנו לנשום לרווחה.

ניתן היה לעבוד לגמרי אחרת,
כשרעש הנפילות לידנו לא טרטר בראשנו
ולא העסיק את מחשבותינו.

אחרי שבועות או חודשים
אפשר היה לצאת שוב למרפסת
או לקרבת החלונות,
מבלי לחשוש מכדורים.""",
]


async def synthesize(text: str, path: Path) -> None:
    last_error = None
    for attempt in range(3):
        try:
            comm = edge_tts.Communicate(text=text, voice=VOICE, rate="-11%", pitch="-1Hz")
            await comm.save(str(path))
            if path.stat().st_size < 2000:
                raise RuntimeError("TTS response unexpectedly small")
            return
        except Exception as err:
            last_error = err
            await asyncio.sleep(2 ** attempt)
    raise RuntimeError(f"Unable to synthesize with {VOICE}: {last_error}")


async def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="kaete-tts-") as td:
        clips = []
        for n, text in enumerate(PARTS, 1):
            path = Path(td) / f"passage-{n}.mp3"
            await synthesize(text.strip(), path)
            clips.append(AudioSegment.from_file(path, format="mp3"))
        combined = (
            AudioSegment.silent(duration=200) +
            clips[0] +
            AudioSegment.silent(duration=1100) +
            clips[1] +
            AudioSegment.silent(duration=600)
        )
        combined.export(str(OUT), format="mp3", bitrate="128k")
        print(f"Created {OUT} — {len(combined)/1000:.1f} sec, {OUT.stat().st_size} bytes")


if __name__ == "__main__":
    asyncio.run(main())