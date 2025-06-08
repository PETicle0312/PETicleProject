@Entity
@Table(name = "schools")
@Getter
@Setter
@NoArgsConstructor
public class SchoolEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long schoolId;

    private String region;

    @Column(name = "school_name")
    private String schoolName;
}
