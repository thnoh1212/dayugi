from typing import List
from module.model.textrankr.textrankr import TextRank


class MyTokenizer:
    def __call__(self, text: str) -> List[str]:
        tokens: List[str] = text.split()
        return tokens


mytokenizer: MyTokenizer = MyTokenizer()
textrank: TextRank = TextRank(mytokenizer)

k: int = 1  # num sentences in the resulting summary

# your_text_here = '''나는 예쁘다, 날씬하다, 멋쟁이다라는 말을 듣는 것을 참 좋아한다.\n\n누구나 그러하겠지만...\n\n평범한 다른 여성들보다 유달리 외모에 관심이 많고, 예쁜 것을 무척이나 선호한다.\n\n그러다 보니 옷이나 신발, 액세서리 구입에 돈을 쓰고, 그 돈을 그다지 아까워하지 않는다.\n\n그로 인해 느껴지는 기쁨이 무엇보다 크기 때문이다.\n\n \n\n그런데, 항암을 하며 살이 빠졌고, 지금은 몸무게가 조금 늘었다고는 하나 예전에 비해 10킬로그램이나 빠져있는 상태다.\n\n당연히 옷을 입은 '태'가 예전 같지 않지만, 그것으로 스트레스를 받지 않으려고 노력한다.\n\n \n\n지난 토,일요일에 연달아 세 팀의 지인들을 만난 후, 좋은 사람들을 만나 즐거울 줄 알았는데, 행복하지 않은, 왠지 허전한 느낌이 들었었다.\n\n그 이유를 며칠동안 곰곰이 생각해보았다.\n\n내가 예상했던것 만큼 그렇게 사랑받고 있지 않다는 느낌. \n\n그들은 어쩔수 없이 '남'이었다는 느낌.\n\n그리고 또 한가지는 그들이 나를 많이 말랐다고 얘기한 것에 대한 서운함마저 얹혀져 있었던 듯하다.\n\n외모를 소중히 생각하는 나에게 말랐다는 말은 가장 듣기 싫은 말이었던 것이다.\n\n'어머나, 여전히 예쁘고, 멋지네~'라는 말을 듣고 싶었던 것이다.\n\n \n\n내가 원장님을 참 좋게 여기는 것은 항상 더 예뻐졌다고 말해주기 때문이다.\n\n기분 좋으라고 좀 더 얹어서 하는 말일지라도 그 말을 들으면 정말 예뻐진 듯 느껴지고, 기분이 좋아지며, 아픈 것도 잊어버리게 되고, 힘이 불끈 솟는다.\n\n아름다움을 추구하는 여성 환자에게 참 예쁘다, 점점 더 예뻐진다, 여전히 예쁘다는 말은 '다 나았다'는 말과 다름 아니다.\n\n \n\n내가 말랐는지는 그 누구보다 내가 더 잘 안다.\n\n그 마름을 감추기 위해 옷으로 얼마나 많이 가리고 있는데...\n\n숨기고 싶은 부분을 굳이 말로 하는 것이 싫었던 것이다.\n\n \n\n그러다 문득 이런 생각이 들었다.\n\n그들의 말에 마음 상할 필요가 없음은 당연한 것이고,\n\n비록 예전보다는 말랐지만, 밖에 나가면 모르는 사람들은 내가 환자인 줄 전혀 모른다는 것이고, 예전과 다름없이 몇 가지 옷을 빼고는 모두 입을 수 있고, 여전히 예쁘다는 것이다.\n\n얼마나 감사한 일인가!\n\n지난봄, 여름... 항암을 할 때는 이렇게 다닐 수 있을 거라고 상상이나 했을까?\n\n욕심이 끝이 없다.\n\n지금 이렇게 예쁘게 꾸미고 나갈 수 있음에 행복하고, 감사할 일이다.\n\n감사합니다^^'''
def summarize_script(script):
    summaries: List[str] = textrank.summarize(script, k, verbose=False)
    return summaries


if __name__ == '__main__':
    while True:
        print(summarize_script(input('scipt:' )))