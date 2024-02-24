import { ROLE } from "~/database/schema";
import qs from "qs";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export default defineEventHandler(async (event) => {
  const query = getQuery<Record<string, string>>(event);
  const parsedQuery = qs.parse(query) as Record<
    string,
    string & Record<"eq" | "neq", string & number>
  >;

  const page = parseInt(parsedQuery.page as string) ?? 0;
  const pageSize = parseInt(parsedQuery.pageSize as string) ?? 5;
  const role = parsedQuery.role;
  const year = parsedQuery.year;
  const classId = parsedQuery.classId;

  const id = event.context.params!.id;

  const user = await useServerUser(event);
  await useUserRoleSchool(event, id, [ROLE.ADMIN, ROLE.DIRECTOR]);

  try {
    const response = await db.transaction().execute(async (tx) => {
      const users = await tx
        .selectFrom("users")
        .select((eb) => [
          "users.id",
          "firstName",
          "lastName",
          "email",
          "telephone",
          jsonArrayFrom(
            eb
              .selectFrom("schoolsUsers")
              .select(["schoolsUsers.id", "role"])
              .where("schoolsUsers.schoolId", "=", id)
              .whereRef("users.id", "=", "schoolsUsers.userId")
          ).as("schools"),
        ])
        .innerJoin("schoolsUsers", "users.id", "schoolsUsers.userId")
        .where(({ and, eb }) =>
          and([
            eb("schoolsUsers.schoolId", "=", id),
            eb("users.id", "!=", user.id),
          ])
        )
        .$if(!!role, (qb) => {
          if (role.eq) {
            return qb.where("schoolsUsers.role", "=", role.eq as ROLE);
          }

          if (role.neq) {
            return qb.where("schoolsUsers.role", "!=", role.neq as ROLE);
          }

          return qb;
        })
        .$if(!!year || !!classId, (qb) => {
          let joinedQb = qb.innerJoin(
            "classes",
            "classes.schoolId",
            "schoolsUsers.schoolId"
          );
          if (year) {
            if (year.eq) {
              joinedQb = joinedQb.where("classes.year", "=", year.eq);
            }

            if (year.neq) {
              joinedQb = joinedQb.where("classes.year", "!=", year.neq);
            }
          }

          if (classId) {
            if (classId.eq) {
              joinedQb = joinedQb.where("classes.id", "=", classId.eq);
            }
            if (classId.neq) {
              joinedQb = joinedQb.where("classes.id", "!=", classId.neq);
            }
          }

          return joinedQb;
        })
        .limit(pageSize)
        .offset(page * pageSize)
        .execute();
      const result = await tx
        .selectFrom("users")
        .select(({ fn }) => fn.count<number>("users.id").as("count"))
        .innerJoin("schoolsUsers", "users.id", "schoolsUsers.userId")
        .where(({ and, eb }) =>
          and([
            eb("schoolsUsers.schoolId", "=", id),
            eb("users.id", "!=", user.id),
          ])
        )
        .$if(!!role, (qb) => {
          if (role.eq) {
            return qb.where("schoolsUsers.role", "=", role.eq);
          }

          if (role.neq) {
            return qb.where("schoolsUsers.role", "!=", role.neq);
          }

          return qb;
        })
        .$if(!!year || !!classId, (qb) => {
          let joinedQb = qb.innerJoin(
            "classes",
            "classes.schoolId",
            "schoolsUsers.schoolId"
          );
          if (year) {
            if (year.eq) {
              joinedQb = joinedQb.where("classes.year", "=", year.eq);
            }

            if (year.neq) {
              joinedQb = joinedQb.where("classes.year", "!=", year.neq);
            }
          }

          if (classId) {
            if (classId.eq) {
              joinedQb = joinedQb.where("classes.id", "=", classId.eq);
            }
            if (classId.neq) {
              joinedQb = joinedQb.where("classes.id", "!=", classId.neq);
            }
          }

          return joinedQb;
        })
        .executeTakeFirst();

      return { users, count: result?.count ?? 0 };
    });

    return {
      users: response.users,
      count: response.count,
    };
  } catch (e) {
    console.error(e);
    return createError({
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      message: "An unknown error has occurred",
    });
  }
});
