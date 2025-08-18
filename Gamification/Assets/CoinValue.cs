using UnityEngine;

[RequireComponent(typeof(Collider2D))]
public class CoinValue : MonoBehaviour
{
    public int points = 1;    // 일반=1, 보너스=3 (프리팹에서 설정)
    private bool collected = false;

    void Reset()
    {
        // 에디터에서 붙일 때 자동 설정 도움
        var col = GetComponent<Collider2D>();
        if (col) col.isTrigger = true;
    }

    public int Collect()
    {
        if (collected) return 0;
        collected = true;

        // 더 이상 접촉 안 되게 콜라이더들 비활성화
        foreach (var c in GetComponentsInChildren<Collider2D>()) c.enabled = false;

        Destroy(gameObject); // 필요하면 딜레이/이펙트로 교체
        return points;
    }
}


