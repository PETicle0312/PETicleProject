using UnityEngine;

[RequireComponent(typeof(Collider2D))]
public class CoinValue : MonoBehaviour
{
    public int points = 1;    // �Ϲ�=1, ���ʽ�=3 (�����տ��� ����)
    private bool collected = false;

    void Reset()
    {
        // �����Ϳ��� ���� �� �ڵ� ���� ����
        var col = GetComponent<Collider2D>();
        if (col) col.isTrigger = true;
    }

    public int Collect()
    {
        if (collected) return 0;
        collected = true;

        // �� �̻� ���� �� �ǰ� �ݶ��̴��� ��Ȱ��ȭ
        foreach (var c in GetComponentsInChildren<Collider2D>()) c.enabled = false;

        Destroy(gameObject); // �ʿ��ϸ� ������/����Ʈ�� ��ü
        return points;
    }
}


