using UnityEngine;
using TMPro; 

public class HUDController : MonoBehaviour
{
    public TMP_Text lightText;
    public TMP_Text bushText;
    public TMP_Text inkText;
    public TMP_Text woodText;

    void Update()
    {
        lightText.text = GlobalVariables.Instance.light + "/1";
        bushText.text = GlobalVariables.Instance.bush + "/1";
        inkText.text = GlobalVariables.Instance.ink + "/1";
        woodText.text = GlobalVariables.Instance.wood + "/1";
    }

}
