@Repository
public interface SchoolStudentRepository extends JpaRepository<SchoolStudentEntity, Long> {
    Optional<SchoolStudentEntity> findByStudentNumberAndSchool_SchoolName(String studentNumber, String schoolName);
}
